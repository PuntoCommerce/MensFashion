"use strict";

/**
 * @namespace SearchServices
 */

var server = require("server");

var cache = require("*/cartridge/scripts/middleware/cache");

var Resource = require("dw/web/Resource");

var preferences = require("*/cartridge/config/preferences.js");

/**
 * SearchServices-GetSuggestions : The SearchServices-GetSuggestions endpoint is responsible for searching as you type and displaying the suggestions from that search
 * @name Base/SearchServices-GetSuggestions
 * @function
 * @memberof SearchServices
 * @param {middleware} - cache.applyDefaultCache
 * @param {querystringparameter} - q - the query string a shopper is searching for
 * @param {category} - non-sensitive
 * @param {returns} - json
 * @param {serverfunction} - get
 */
server.get(
  "GetSuggestions",
  cache.applyDefaultCache,
  function (req, res, next) {
    var SuggestModel = require("dw/suggest/SuggestModel");
    var CategorySuggestions = require("*/cartridge/models/search/suggestions/category");
    var ContentSuggestions = require("*/cartridge/models/search/suggestions/content");
    var ProductSuggestions = require("*/cartridge/models/search/suggestions/product");
    var SearchPhraseSuggestions = require("*/cartridge/models/search/suggestions/searchPhrase");
    var categorySuggestions;
    var contentSuggestions;
    var productSuggestions;
    var recentSuggestions;
    var popularSuggestions;
    var brandSuggestions;
    var mobile = req.querystring.mobile;
    var searchTerms = req.querystring.q;
    var suggestions;
    // TODO: Move minChars and maxSuggestions to Site Preferences when ready for refactoring
    var minChars = preferences.minTermLength;
    // Unfortunately, by default, max suggestions is set to 10 and is not configurable in Business
    // Manager.
    var maxSuggestions = 8;

    if (searchTerms && searchTerms.length >= minChars) {
      suggestions = new SuggestModel();
      suggestions.setFilteredByFolder(false);
      suggestions.setSearchPhrase(searchTerms);
      suggestions.setMaxSuggestions(maxSuggestions);
      categorySuggestions = new CategorySuggestions(
        suggestions,
        maxSuggestions
      );
      contentSuggestions = new ContentSuggestions(suggestions, maxSuggestions);
      productSuggestions = new ProductSuggestions(suggestions, maxSuggestions);
      recentSuggestions = new SearchPhraseSuggestions(
        suggestions.recentSearchPhrases,
        maxSuggestions
      );
      popularSuggestions = new SearchPhraseSuggestions(
        suggestions.popularSearchPhrases,
        maxSuggestions
      );
      brandSuggestions = new SearchPhraseSuggestions(
        suggestions.brandSuggestions,
        maxSuggestions
      );

      if (
        productSuggestions.available ||
        contentSuggestions.available ||
        categorySuggestions.available ||
        recentSuggestions.available ||
        popularSuggestions.available ||
        brandSuggestions.available
      ) {
        var total =
          productSuggestions.products.length +
          contentSuggestions.contents.length +
          categorySuggestions.categories.length +
          recentSuggestions.phrases.length +
          popularSuggestions.phrases.length +
          brandSuggestions.phrases.length;
        res.render("search/suggestions", {
          suggestions: {
            product: productSuggestions,
            category: categorySuggestions,
            content: contentSuggestions,
            recent: recentSuggestions,
            popular: popularSuggestions,
            brand: brandSuggestions,
            message: Resource.msgf(
              "label.header.search.result.count.msg",
              "common",
              null,
              ["" + total]
            ),
          },
        });
      } else {
        res.json({});
      }
    } else {
      // Return an empty object that can be checked on the client.  By default, rendered
      // templates automatically get a diagnostic string injected into it, making it difficult
      // to check for a null or empty response on the client.
      res.json({});
    }

    next();
  }
);

module.exports = server.exports();
