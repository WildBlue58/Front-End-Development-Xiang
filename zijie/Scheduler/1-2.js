class Scheduler{
    constructor(limit) {
        this.limit = limit;
        this.count = 0;
        this.queue = [];
    }

    async add(fn) {
        if (this.count >= this.limit) {
            await new Promise(resolve => this.queue.push(resolve));
        }

        this.count++;

        const res = await fn();

        this.count--;

        if (this.queue.length > 0) {
            this.queue.shift()();
        }

        return res;
    }
}