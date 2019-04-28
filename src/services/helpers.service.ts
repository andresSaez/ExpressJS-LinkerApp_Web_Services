

export class HelpersService {

    static getDistance( lat1: number, lng1: number, lat2: any, lng2: any ) {

        const earthRadius = 6371; // Km
        // const earth = 3960; // miles, change accordingly

        // Point 1 coords
        lat1 = (Math.PI / 180)*lat1;
        lng1 = (Math.PI / 180)*lng1;

        // Point 2 coords
        lat2 = (Math.PI / 180)*lat2;
        lng2 = (Math.PI / 180)*lng2;

        //Haversine Formula
        const dlng = lng2 - lng1;
        const dlat = lat2 - lat1;

        const sinlat = Math.sin(dlat/2);
        const sinlng = Math.sin(dlng/2);

        const a = ( sinlat * sinlat ) + Math.cos( lat1 ) * Math.cos( lat2 ) * ( sinlng * sinlng );

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        // const c = 2 * Math.asin(Math.min(1, Math.sqrt(a))); // Similar 



        const d = Math.round( earthRadius * c );

        return d;

    }
}