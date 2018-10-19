import * as loadAction from './loading';
import MiddleWare from "../middleware/api";
import { debuglog } from 'util';

export function fetchAllQuotes(token, callback){
    let m = new MiddleWare(token);
    return m.makeConnection('/purchase/quotation/', m.GET).then((response) => {
        return response.json()
    }).then(        
        (responseJson)=>{
            callback(responseJson);
        }
    );
}

export function fetchQuotesByRequisitionId(token, id, callback){
    let m = new MiddleWare(token);
    return m.makeConnection('/purchase/quotation/index/'+id, m.GET).then((response) => {
        return response.json()
    }).then(        
        (responseJson)=>{
            callback(responseJson);
        }
    );
}

export function findQuotationById(token, id, callback){
    let m = new MiddleWare(token);
    return m.makeConnection('/purchase/quotation/view/'+id, m.GET).then((response) => {
        return response.json();
    }).then(        
        (responseJson)=>{
            callback(responseJson);
            //props.dispatch(loadAction.LoadingSuccess());
        }
    );
}

export function submitQuotation(token, data, callback){
    let m = new MiddleWare(token);
    return m.makeConnection('/purchase/quotation/submit', m.POST, data).then(
        (result)=>{
            if(result.ok && result.statusText == "OK" && result.status == 200 ) callback(result.ok);
    });   
}

export function editQuotation(token, id, data, callback){
    let m = new MiddleWare(token);
    return m.makeConnection('/purchase/quotation/update/'+id, m.POST, data).then((result)=>{
        {{debugger}}
        if(result.ok && result.statusText == "OK" && result.status == 200 )callback(result.ok);
    }); 
}