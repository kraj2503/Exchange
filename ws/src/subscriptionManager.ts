import { createClient, RedisClientType } from "redis";
import { UserManager } from "./userManager";
import { CLOSING } from "ws";

export class SubscriptionManager {
  private static instance: SubscriptionManager;
  private subscriptions: Map<string, string[]> = new Map();
  private reverseSubscriptions: Map<string, string[]> = new Map();
  private redisClient: RedisClientType;

  private constructor() {
    this.redisClient = createClient();
    this.redisClient.connect();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new SubscriptionManager();
    }
    return this.instance;
  }
  public subscribe(userId: string, subscription: string) {
    if (this.subscriptions.get(userId)?.includes(subscription)) {
      return;
    }
    console.log("subscribing  ", userId, "to ", subscription);
    this.subscriptions.set(
      userId,
      (this.subscriptions.get(userId) || []).concat(subscription)
    );

    this.reverseSubscriptions.set(
      subscription,
      (this.reverseSubscriptions.get(subscription) || []).concat(userId)
    );
    console.log(
      `reverse subs-  ${this.reverseSubscriptions.get(subscription)}`
    );

    if (this.reverseSubscriptions.get(subscription)?.length === 1) {
      this.redisClient.subscribe(
        subscription,
        this.redisCallbackHandler.bind(this)
      );
    }
  }

  private redisCallbackHandler(message: string, channel: string) {
    console.log(`[Redis] Message received on channel "${channel}":`, message);
  
    const parsedMessage = JSON.parse(message);
    this.reverseSubscriptions
      .get(channel)
      ?.forEach((userId) => {
        const user = UserManager.getInstance().getUser(userId);
        if (user) {
          user.emit(parsedMessage);
        }
      });
  }

  public unsubscribe(userId: string, subscription: string) {
    const subscriptions = this.subscriptions.get(userId);
    if (subscriptions) {
      this.subscriptions.set(
        userId,
        subscriptions.filter((s) => s !== subscription)
      );
    }

    const reverseSubscriptions = this.reverseSubscriptions.get(subscription);
    if (reverseSubscriptions) {
      const updated = reverseSubscriptions.filter((s) => s !== userId);

      if (updated.length === 0) {
        this.reverseSubscriptions.delete(subscription);
        this.redisClient.unsubscribe(subscription);
      } else {
        this.reverseSubscriptions.set(subscription, updated);
      }

      return;
    }
  }

  public userLeft(userId: string) {
    console.log("User left ", userId);
    this.subscriptions.get(userId)?.forEach((s) => this.unsubscribe(userId, s));
  }

  getSubscriptions(userId: string) {
    return this.subscriptions.get(userId) || [];
  }
}
