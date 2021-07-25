const { hooks } = require('@adonisjs/ignitor');

hooks.after.providersBooted(() => {
  const View = use('View');
  const Config = use('Config');

  View.global('config', Config);
});

// const axios = require('axios');
// const cheerio = require('cheerio');
// (async () => {
//   try {
//     const response = await axios.get('https://scholar.google.com/citations?hl=id&user=g2K8w6gAAAAJ');
//     const $ = cheerio.load(response.data);
//     const domPublications = $('#gsc_a_t .gsc_a_tr');
//     const publications = [];
//     if (domPublications.length > 0) {
//       domPublications.each((idx) => {
//         const domPublication = $.load(domPublications[idx]);
//         const title = $.load(domPublication('.gsc_a_at')['0']).text();
//         const gs_gray = domPublication('.gs_gray');
//         const authors = $.load(gs_gray['0']).text();
//         const venue = $.load(gs_gray['1']).html();
//         const citation = parseInt($.load(domPublication('.gsc_a_ac')['0']).text());
//         const year = parseInt($.load(domPublication('.gsc_a_h')['0']).text());
//         const publication = {
//           title,
//           authors,
//           // venue,
//           citation: isNaN(citation) ? 0 : citation,
//           year: isNaN(year) ? 0 : year,
//         };
//         publications.push(publication);
//       });
//     }
//     console.log({ publications });
//   } catch (error) {
//     console.log(error);
//   }
// })();
