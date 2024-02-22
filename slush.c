//SLUSH - The SLU SHELL
//
//This assignment reads user input, and executes that input as a sequence of
//programs to execute.
//
//Program execution commands have the form:
//
//prog_n [args] ( ... prog_3 [args] ( prog_2 [args] ( prog_1 [args]
//
//For example, "grep slush ( sort -r ( ls -l -a" returns a reverse sorted list
//of all files in the current directory that contain the string "slush" in
//
//See the lab writeup for more details and other requirements.
//

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>
#include <errno.h>
#include <signal.h>

#define MAX_ARGS 15
#define MAX_LINE_LENGTH 256

void sigint_handler(int signum) {
	//当用户输入Crtl + C时打印
	printf("Ignore SIGINT.\n");
	
	//当用户输入Crtl + C时，换到下一行供用户输入新的指令
	printf("\n");
	printf("slush> ");
	fflush(stdout);

}

void execute_command(char *command) {
    char *args[MAX_ARGS + 2];
    int arg_count = 0;

    char *token = strtok(command, " \t\n");
    while (token != NULL && arg_count < MAX_ARGS) {
        args[arg_count++] = token;
        token = strtok(NULL, " \t\n");
    }
    args[arg_count] = NULL;

    if (arg_count > 0) {
        if (strcmp(args[0], "cd") == 0) {
            if (arg_count == 1) {
                // Change to HOME directory if no directory argument is provided with cd
                char *home_dir = getenv("HOME");
                if (home_dir != NULL) {
                    if (chdir(home_dir) == -1) {
                        perror("chdir");
                    }
                } else {
                    fprintf(stderr, "cd: HOME not set\n");
                }
            } else if (arg_count == 2) {
                // Change to specified directory
                if (chdir(args[1]) == -1) {
                    perror("chdir");
                }
            } else {
                // More than one argument provided with cd, which is invalid
                fprintf(stderr, "cd: too many arguments\n");
            }
        } else {
            if (execvp(args[0], args) == -1) {
                fprintf(stderr, "%s: %s\n", args[0], strerror(errno));
            }
        }
    }
}





void execute_pipeline(char *commands[]) {
    int i = 0;
    int in_fd = STDIN_FILENO;
    int cur_pipe[2];

    while (commands[i] != NULL) {
        if (pipe(cur_pipe) == -1) {
            perror("pipe");
            exit(EXIT_FAILURE); // 或者采取其他错误处理措施
        }

        pid_t pid = fork();
        if (pid == -1) {
            perror("fork");
            exit(EXIT_FAILURE); // 或者采取其他错误处理措施
        } else if (pid == 0) { // 子进程
            close(cur_pipe[0]); // 不需要读端
            if (in_fd != STDIN_FILENO) {
                dup2(in_fd, STDIN_FILENO);
                close(in_fd);
            }
            if (commands[i + 1] != NULL) { // 不是最后一个命令
                dup2(cur_pipe[1], STDOUT_FILENO);
            }
            close(cur_pipe[1]);
            execute_command(commands[i]);
            exit(EXIT_FAILURE); // 防止exec失败继续执行
        } else { // 父进程
            close(cur_pipe[1]); // 关闭写端
            if (in_fd != STDIN_FILENO) {
                close(in_fd); // 关闭上一轮的读端
            }
            in_fd = cur_pipe[0]; // 为下一轮准备读端
            i++;
        }
    }
    if (in_fd != STDIN_FILENO) {
        close(in_fd); // 关闭最后的读端
    }
    while (wait(NULL) > 0); // 等待所有子进程
}



int main() {
    char line[MAX_LINE_LENGTH];

    signal(SIGINT, sigint_handler);

    while (1) {
        printf("slush> ");
        fflush(stdout);

        if (fgets(line, MAX_LINE_LENGTH, stdin) == NULL) {
            printf("\n");
            break;
        }

        line[strcspn(line, "\n")] = '\0';

        // 特别处理cd命令
        if (strncmp(line, "cd ", 3) == 0 || strcmp(line, "cd") == 0) {
            // 分割命令和参数
            char *args[MAX_ARGS + 2];
            int arg_count = 0;
            char *token = strtok(line, " \t\n");
            while (token != NULL && arg_count < MAX_ARGS) {
                args[arg_count++] = token;
                token = strtok(NULL, " \t\n");
            }
            args[arg_count] = NULL;

            // 执行cd命令
            if (args[1] == NULL || strcmp(args[1], "~") == 0) {
                args[1] = getenv("HOME"); // 默认到HOME目录
            }
            if (chdir(args[1]) == -1) {
                perror("chdir");
            }
            continue; // 继续下一个循环
        }

        char *commands[MAX_ARGS + 1];
        int command_count = 0;
        char *token = strtok(line, "(");
        while (token != NULL && command_count < MAX_ARGS) {
            commands[command_count++] = token;
            token = strtok(NULL, "(");
        }

        commands[command_count] = NULL;

        execute_pipeline(commands);
    }

    return 0;
}
