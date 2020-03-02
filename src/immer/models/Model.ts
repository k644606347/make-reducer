export default abstract class Model<State> {
    abstract namespace: string;
    state: State;
    constructor({ initialState }: { initialState: State }) {
        if (this.state === undefined)
            this.state = initialState;
    }
}