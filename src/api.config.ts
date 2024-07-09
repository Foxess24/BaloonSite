// API
export const SERVER_API = {
  //Utente
  urlCreateUtente: 'http://localhost:3000/api/createUtente',
  urlLoginUtente: 'http://localhost:3000/api/loginUtente',
  urlGetUtente: 'http://localhost:3000/api/getUtente',
  urlDeleteUtente: 'http://localhost:3000/api/deleteUtenteByID',
  urlForgotPassword: 'http://localhost:3000/api/forgotPSW',
  urlAdmin: 'http://localhost:3000/api/isAdmin',

  //Prodotti
  urlPostProdotto: 'http://localhost:3000/api/postProdotto',
  urlGetProdotti: 'http://localhost:3000/api/getProdotti',
  urlGetProdotto: 'http://localhost:3000/api/getProdotto',
  urlDeleteProdotto: 'http://localhost:3000/api/deleteProdotto',

  //Ordini
  urlGetOrdini: 'http://localhost:3000/api/getOrdini',
  urlDeleteOrdine: 'http://localhost:3000/api/deleteOrdine',
  urlPutOrdine: 'http://localhost:3000/api/putOrdine',
  urlPostOrdine: 'http://localhost:3000/api/postOrdine',
  urlPutQuantitaAdd: 'http://localhost:3000/api/putQuantitaAdd',
  urlPutQuantitaRemove: 'http://localhost:3000/api/putQuantitaRemove',
};
