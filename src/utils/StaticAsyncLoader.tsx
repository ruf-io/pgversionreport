const waitingSym = Symbol("waiting");

export class StaticAsyncLoader<T> {
    private promise: Promise<T>;
    private result: any;

    constructor(promise: Promise<T>) {
        this.promise = promise;
        this.result = waitingSym;
        this.promise.then((result) => {
            this.result = result;
        });
    }

    get() {
        if (this.result === waitingSym) {
            throw this.promise;
        }
        return this.result;
    }
}

export function ComponentLoader<Props>({
    loader,
    props,
}: {
    loader: StaticAsyncLoader<React.ComponentType<Props>>;
    props: Props;
}) {
    const Component = loader.get();
    return <Component {...props} />;
}
