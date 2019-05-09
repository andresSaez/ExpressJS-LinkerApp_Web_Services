const OneSignal = require('onesignal-node');
import { environment } from '../../environments/environment';

// export let client = new OneSignal.Client({
//     userAuthKey: environment.oneSignal.appAuthKey,
//     app: { appAuthKey: environment.oneSignal.appAuthKey, appId: environment.oneSignal.appId }
// });

export class PushService {

    private static client = new OneSignal.Client({
        userAuthKey: environment.oneSignal.appAuthKey,
        app: { appAuthKey: environment.oneSignal.appAuthKey, appId: environment.oneSignal.appId }
    });

    constructor() {
        // this.client = new OneSignal.Client({
        //     userAuthKey: environment.oneSignal.appAuthKey,
        //     app: { appAuthKey: environment.oneSignal.appAuthKey, appId: environment.oneSignal.appId }
        // });
    }

    static async sendMessage(userId: string, title: string, body: string, data: any ) {
        const firstNotification = new OneSignal.Notification({
            headings: {
                en: title,
            },
            contents: {
                en: body,
            },
            data,
            include_player_ids: [userId],
        });


        this.client.sendNotification(firstNotification, (err: any, httpResponse: any, data: any) => {
            if (err) {
                console.log(err);
            } else {
                console.log(data, httpResponse.statusCode);
            }
        });
    }
}