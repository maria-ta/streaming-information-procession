import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import {Server, Socket} from "socket.io";
import {interval, map, Observable, Subject, takeUntil, tap} from "rxjs";

type ZeroOne = 0 | 1;

const THREAD_NUMBER = 9;
const C = 0.000001;

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private threads: Observable<ZeroOne>[] = [];
  private t: number[] = [];
  private sum: number[] = [];

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  private disconnect$: Subject<void> = new Subject();


  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    this.sendThreadNumber();

    setTimeout(() => {
      this.createThreads(THREAD_NUMBER);
    }, 2000);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.sum = [];
    this.t = [];
    this.disconnect$.next();
    this.disconnect$.complete();
  }


  private createThreads(n: number) {
    this.threads = [];

    for (let i = 0; i < n; i++) {
      this.sum.push(0);
      this.t.push(0);
      const thread = this.createThread(i);
      thread.pipe(takeUntil(this.disconnect$)).subscribe();
      this.threads.push(thread);
    }
  }

  private createThread(index: number): Observable<ZeroOne> {
    const intervalMilliseconds = this.getRandomNumber(4000, 5000);

    return interval(intervalMilliseconds)
        .pipe(
            map(() => {
              return this.getZeroOrOne();
            }),
            tap((value) => {
              console.log(`#${index} - ${value}`);
              this.sendThreadValue(index, value);
            }),
            tap((value) => {
              const currentSum = this.sum[index];
              const nextSumInitial = currentSum * (1 - C) + value;
              const nextSum = nextSumInitial > 0.5 ? nextSumInitial : 0;
              this.sum[index] = nextSum;
              this.sendThreadSum(index, nextSum);
            }),
            tap(() => {
              const {i, value} = this.findMaxElem(this.sum);
              this.sendMaxSum(i, value);
            }),
        );
  }


  private sendThreadNumber() {
        this.server.emit('threadNumber', THREAD_NUMBER);
    }

  private sendThreadValue(threadIndex: number, value: ZeroOne): void {
    this.server.emit('threadValue', { i: threadIndex, value });
  }

  private sendThreadSum(threadIndex: number, value: number): void {
    this.server.emit('threadSum', { i: threadIndex, value });
  }

  private sendMaxSum(threadIndex: number, value: number): void {
    this.server.emit('maxSum', { i: threadIndex, value });
  }


  private getRandomNumber(from: number, to: number): number {
    return Math.random() * (to - from) + to;
  }

  private getZeroOrOne(): ZeroOne {
    return Math.random() > 0.5 ? 1 : 0;
  }

  private findMaxElem(arr: number[]): {i: number, value: number} {
        let iMax: number | undefined;

        for (let i = 0; i < arr.length; i++ ) {
            if (arr[iMax] < arr[i] || typeof iMax === 'undefined') {
                iMax = i;
            }
        }

        return {
            i: iMax,
            value: arr[iMax]
        };
    }
}
