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

// const MAX_NUMBER = 342;
// const L = 9;
// const MAX_NUMBER = 9;
// const L = 6;
const MAX_NUMBER = 713;
const L = 10;

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private thread: Observable<number>;

  private maxR = 0;
  private set: Set<number>;

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  private disconnect$: Subject<void> = new Subject();


  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    this.set = new Set<number>();
    this.sendMaxNumber();

    setTimeout(() => {
      this.thread = this.createThread();
      this.thread
          .pipe(
              takeUntil(this.disconnect$)
          )
          .subscribe();
    }, 2000);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.disconnect$.next();
    this.disconnect$.complete();
  }

  private createThread(): Observable<number> {
    const intervalMilliseconds = 100;

    return interval(intervalMilliseconds)
        .pipe(
            map(() => {
              return this.getRandomNumber(0, MAX_NUMBER);
            }),
            tap((value) => {
              this.sendThreadValue(value);
            }),
            tap((value) => {
              this.set.add(value);
              this.sendTotalCount(this.set.size);
            }),
            tap((value) => {
              const h = this.h(value);
              const binH = this.dec2bin(h);
              const r = this.r(binH);
              console.log(`${value} ${h} ${binH} ${r}`);
              this.maxR = this.maxR < r ? r : this.maxR;
              this.sendNumberCount(this.getNumberCount(this.maxR));
            }),
        );
  }

  private h(x: number) {
    return Math.floor((6*x + 1) / 5);
  }

  private r(bin: string): number {
    for (let i = bin.length - 1; i > 0; i--) {
      if (bin[i] === '1') {
        return bin.length - i - 1;
      }
    }
    return 0;
  }

  private getNumberCount(r: number): number {
    return Math.pow(2, r);
  }


  private sendMaxNumber() {
        this.server.emit('maxNumber', MAX_NUMBER);
    }

  private sendThreadValue(value: number): void {
    this.server.emit('threadValue', { value });
  }

  private sendNumberCount(value: number): void {
    this.server.emit('numberCount', { value });
  }

  private sendTotalCount(i: number): void {
    this.server.emit('totalCount', { value: i });
  }


  private getRandomNumber(from: number, to: number): number {
    return Math.round(Math.random() * (to - from) + from);
  }

  private dec2bin(n: number): string {
    return n.toString(2).padStart(L, '0');
  }
}
