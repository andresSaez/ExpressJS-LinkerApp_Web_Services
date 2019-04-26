const request = require('request');


export default class AuthService {
    static comprobarTokenGoogle(token: any) {
        return new Promise((resolve, reject) => {
          request.get('https://www.googleapis.com/plus/v1/people/me?access_token='+token, function(err: any, resp: any, body: any) {
            if (err) {
              reject(err);
            } else{
              resolve(JSON.parse(body));
            }
          });   
        })
    }
}


