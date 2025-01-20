export class FakeCompileTsAdapter {
    fsPort;
    constructor(fsPort) {
        this.fsPort = fsPort;
    }
    async compile(inputPath) {
        const tsContent = await this.fsPort.readFile(inputPath);
        return tsContent;
    }
}
//# sourceMappingURL=fake-compile-ts.adapter.js.map