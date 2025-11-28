const headers ={
    "Accept" :"application/json",
    "Content-type": "application/json"
}


function joinURL(baseURL, url){
    return `${baseURL}/${url}`;
}

class Service {

    constructor(){
        this.domain = process.env.REACT_APP_BACKEND_URL;
    }

    request(url,method="POST",data=null){
        // console.log("REQUEST",data)
        url = joinURL(this.domain,url);
        // console.log("REQUEST",url)
        const options = {
            method,
            headers,
        }
        if(data){
            // options.mode = 'cors';
            options.body = JSON.stringify({...data});
        }
        // console.log(options)
        return fetch(url,options);
    };

    post(url,data){
        const method ='POST';
        // console.log("data",data)
        return this.request(url,method,data).then(res =>{  
            if(!res.ok)
                throw Error('Could Not Fetch Data from Resource')
            return res.json()
        });
    };

    get(url){
        const method ='GET';
        // console.log("IN GETTTT", url);
        return this.request(url,method).then(res => {
            // console.log("IN REQUEST Result")
            if(!res.ok){
                // console.log("IN REQUEST Result IFFFF")
                throw Error('Could Not Fetch Data from Resource')}
            // console.log("IN REQUEST result ELSEEE")
            return res.json()
        });
    };

    delete(url){
        const method ='DELETE';
        return this.request(url,method,null).then(res => res.json());
    };

    put(url,data){
        const method ='PUT';
        return this.request(url,method,data).then(res =>{  
            if(!res.ok)
                throw Error('Could Not Fetch Data from Resource')
            return res.json()
        });   
    };
}

export default Service;