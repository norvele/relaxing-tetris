type KeyCode = string;
type SubscriptionId = string;

interface KeyboardSubscriptionConfig {
  repeat:
    | false
    | {
        timeout: number;
        delay: number;
      };
}

interface KeyboardSubscription {
  code: KeyCode;
  callback(): void;
  config: KeyboardSubscriptionConfig;
}

interface PressedKey {
  isEmitted: boolean;
  isRepeated: boolean;
  needRemove: boolean;
  lastTimestamp: number;
}

export interface KeyboardEventInitiatorI {
  keyDown(code: KeyCode): void;
  keyUp(code: KeyCode): void;
  on(
    code: KeyCode,
    callback: () => void,
    config?: KeyboardSubscriptionConfig
  ): SubscriptionId;
  remove(id: SubscriptionId): void;
}

export class KeyboardEventInitiator implements KeyboardEventInitiatorI {
  protected subscriptions: Record<SubscriptionId, KeyboardSubscription> = {};
  protected pressedKeys: Record<KeyCode, PressedKey> = {};
  protected timeInterval: any;

  constructor() {
    this.timeInterval = setInterval(this.process.bind(this), 1);
  }

  public keyDown(code: KeyCode) {
    const now = Date.now();
    this.pressedKeys[code] = {
      isEmitted: false,
      isRepeated: false,
      needRemove: false,
      lastTimestamp: now,
    };
  }

  public keyUp(code: KeyCode) {
    if (!this.pressedKeys[code]) {
      return;
    }
    if (this.pressedKeys[code].isEmitted) {
      delete this.pressedKeys[code];
      return;
    }
    this.pressedKeys[code].needRemove = true;
  }

  public on(
    code: KeyCode,
    callback: () => void,
    config: KeyboardSubscriptionConfig = { repeat: false }
  ) {
    const id = (Date.now().toString() +
      Math.random().toString()) as SubscriptionId;
    this.subscriptions[id] = {
      code,
      callback,
      config,
    };
    return id;
  }

  public remove(id: SubscriptionId) {
    delete this.subscriptions[id];
  }

  protected process() {
    const now = Date.now();
    Object.entries(this.pressedKeys).forEach(([code, pressedKey]) => {
      Object.values(this.subscriptions).forEach((subscription) => {
        if (subscription.code !== code) {
          return;
        }
        if (!subscription.config.repeat) {
          this.emit(code);
          delete this.pressedKeys[code];
          return;
        }
        if (!pressedKey.isEmitted) {
          this.emit(code);
          return;
        }
        if (
          !pressedKey.isRepeated &&
          now > pressedKey.lastTimestamp + subscription.config.repeat.delay
        ) {
          this.emit(code, true);
          return;
        }
        if (
          pressedKey.isRepeated &&
          now > pressedKey.lastTimestamp + subscription.config.repeat.timeout
        ) {
          this.emit(code, true);
          return;
        }
      });
    });
  }

  protected emit(emittedCode: KeyCode, isRepeat = false) {
    const now = Date.now();
    Object.values(this.subscriptions).forEach(({ code, callback }) => {
      if (code === emittedCode) {
        callback();
        this.pressedKeys[code].isEmitted = true;
        this.pressedKeys[code].lastTimestamp = now;
        if (isRepeat) {
          this.pressedKeys[code].isRepeated = true;
        }
        if (this.pressedKeys[code].needRemove) {
          delete this.pressedKeys[code];
        }
      }
    });
  }
}
