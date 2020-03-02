import Model from "./Model";
import { infer, FuncName, InferFunc } from "../Tools";

const inferObj = infer<Student, StudentState, DispatchActions>();

type DispatchActions = {
    [k in FuncName<Student>]: InferFunc<StudentState, Student[k]>
}

let delaySet = inferObj.inferEffect((actions, payload) => {
    console.log(actions);
    return Promise.resolve(1);
});


type StudentState = {
    name: string;
    id: string;
}
export default class Student extends Model<StudentState> {
    initialState = {
        name: 'xx',
        id: '1',
    }
    namespace: 'student'
    constructor(config) {
        super(config);
        console.log(this.state);
    }
    setName(payload: string) {
        this.state.name = payload;
    }
    delay(actions: DispatchActions) {

    }
    delay3() {
        return Promise.resolve(123);
    }
}
