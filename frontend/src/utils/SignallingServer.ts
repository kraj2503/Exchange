import { Ticker } from "@/app/lib/types";
const BASE_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080";

export class SignalingManager {
  private ws: WebSocket;
  private static instance: SignalingManager;
  private bufferedMessages: any[] = [];
  private callback: any = {};
  private id: number;
  private initialized: boolean = false;

  private constructor() {
    this.ws = new WebSocket(BASE_URL);
    this.bufferedMessages = [];
    this.id = 1;
    this.init();
  }
  //singleton Pattern
  public static getInstance() {
    if (!this.instance) {
      this.instance = new SignalingManager();
    }
    return this.instance;
  }

  init() {
    this.ws.onopen = () => {
      this.initialized = true;
      this.bufferedMessages.forEach((msg) => {
        this.ws.send(JSON.stringify(msg));
      });
      this.bufferedMessages = [];
    };

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const type = msg.data.e;

      if (this.callback[type]) {
        this.callback[type].forEach(({ callback }) => {
   
          if (type === "ticker") {
            const newTicker: Partial<Ticker> = {
              lastPrice: msg.data.c,
              high: msg.data.h,
              low: msg.data.l,
              volume: msg.data.v,
              quoteVolume: msg.data.V,
              symbol: msg.data.s,
            };
            callback(newTicker);
          }

          if (type === "depth") {
            const updatedBids = msg.data.b;
            const updatedasks = msg.data.a;
            callback({ bids: updatedBids, asks: updatedasks });
          }
        });
      }
    };
  }

  sendMessage(msg: any) {
    const MsgtoSend = {
      ...msg,
      id: this.id++,
    };
    if (!this.initialized) {
      this.bufferedMessages.push(MsgtoSend);
      return;
    }
    this.ws.send(JSON.stringify(MsgtoSend));
  }

  async registerCallback(type: string, callback: any, id: string) {
    this.callback[type] = this.callback[type] || [];
    this.callback[type].push({ callback, id });
    // "ticker" => callback
}

  async deRegisterCallback(type: string, id: string) {
    if (this.callback[type]) {
      const index = this.callback[type].findIndex(
        (callback) => callback.id === id
      );
      if (index !== -1) {
        this.callback[type].splice(index, 1);
      }
    }
  }
}
