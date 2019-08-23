import makeReducer from "../../../utils/makeReducer";
import { DocumentCheck } from "../../../models/DocumentCheck";

export default makeReducer({
    namespace: 'test',
    initialState: {
        ack: 0,
        audit: '-1',
        ctime: "2019-08-22 10:48:11",
        cuser: "system",
        dirtyImgs: "",
        document_id: "hytcern2657152",
        id: "295722",
        msg: ",0,",
        mtime: "2019-08-22 10:50:30",
        mtime_unix: 1566442091,
        muser: "jiangyu3@staff.sina.com.cn",
        muser_editor_group: "",
        origin_from: 0,
        original_link: "http://www.ifnews.com/17/detail-43034.html",
        package_type: 1,
        remarks: "",
        source: '4',
        task_id: "5858fccee138233f9d645621",
    } as DocumentCheck,
    reducers: {
        audit(state, action) {
            let { audit } = action;

            return { audit };
        },
        updateMsg(state, action) {
            let { msg } = action;

            return { msg };
        }
    }
});