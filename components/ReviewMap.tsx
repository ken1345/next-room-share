"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react"; // useEffectを追加
import { MdStar, MdEdit } from "react-icons/md";

// Leafletのデフォルトアイコン問題を解決するロジック
// コンポーネントの外ではなく、中で設定するのが確実です

// サンプルデータ
const reviews = [
  { id: 1, lat: 35.658034, lng: 139.701636, title: "渋谷・神泉エリア", rating: 5, text: "駅近なのに静か。スーパーも近くて自炊派には最高です。" },
  { id: 2, lat: 35.702258, lng: 139.560431, title: "三鷹の森ハウス", rating: 4, text: "公園が目の前！休日はシェアメイトとピクニックしてます。" },
  { id: 3, lat: 35.714013, lng: 139.796648, title: "浅草リバーサイド", rating: 5, text: "隅田川の花火が屋上から見えます。外国人の入居者が多め。" },
  { id: 4, lat: 34.702485, lng: 135.495951, title: "梅田スカイシェア", rating: 4, text: "大阪駅まで徒歩圏内。便利すぎて引っ越せません。" },
  { id: 5, lat: 33.590184, lng: 130.401733, title: "博多グルメハウス", rating: 5, text: "近くに美味しい屋台がたくさん。太ります（笑）" },
];

const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function ReviewMap() {

  // useEffectによるグローバル設定削除 (これがエラーの原因になることがあるため)

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 relative z-0">
      <MapContainer
        center={[35.6895, 139.6917]}
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reviews.map((rev) => (
          <Marker key={rev.id} position={[rev.lat, rev.lng]} icon={customIcon}>
            <Popup>
              <div className="w-52">
                <h3 className="font-bold text-gray-800 text-sm mb-1">{rev.title}</h3>
                <div className="flex text-yellow-500 text-xs mb-2">
                  {[...Array(5)].map((_, i) => (
                    <MdStar key={i} className={i < rev.rating ? "" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                  {rev.text}
                </p>
                <button className="w-full bg-[#bf0000] text-white text-xs font-bold py-2 rounded flex items-center justify-center gap-1 hover:bg-red-700 transition">
                  <MdEdit /> 口コミを書く
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}