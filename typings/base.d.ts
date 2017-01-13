declare function testAsync(runAsync: (done?: () => void) => Promise<any>): (done: () => void) => void;
