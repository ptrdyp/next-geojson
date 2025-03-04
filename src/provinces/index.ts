import { FeatureCollection, Geometry } from 'geojson';
import { Aceh } from './aceh';
import { Bengkulu } from './bengkulu';
import { Jambi } from './jambi';
import { KepBangka } from './kep-bangka';
import { KepRiau } from './kep-riau';
import { Lampung } from './lampung';
import { Riau } from './riau';
import { SumateraBarat } from './sumatera-barat';
import { SumateraSelatan } from './sumatera-selatan';
import { SumateraUtara } from './sumatera-utara';

export const provinces: FeatureCollection<Geometry> | any  = {
    "type": "FeatureCollection",
    "features": [
        Aceh,
        Bengkulu,
        Jambi,
        KepBangka,
        KepRiau,
        Lampung,
        Riau,
        SumateraBarat,
        SumateraSelatan,
        SumateraUtara
    ]
}