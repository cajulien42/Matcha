
/* user = {lat, lon} 
  return distance in km
*/
module.exports = (user1, user2) => {
  const toRad = (degrees) => (degrees * Math.PI / 180);
  const R = 6371;
  const lat1 = user1.lat;
  const lat2 = user2.lat;
  const dLat = toRad(user1.lat - user2.lat);
  const dLon = toRad(user1.lon - user2.lon);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return (R * c);
};
