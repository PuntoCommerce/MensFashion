var predefinedStores = [
    {
        lowercase: "Ciudad de México",
        capital: "Ciudad de México",
        stores: [],
        index: 0,
    },
    {
        lowercase: "DF",
        capital: "DF",
        stores: [],
        index: 1,
    },
    {
        lowercase: "Estado de México",
        capital: "EDO MÉX",
        abbreviation: "MEX",
        stores: [],
        index: 2,
    },
    {
        lowercase: "Aguascalientes",
        capital: "AGUASCALIENTES",
        stores: [],
        index: 3,
    },
    {
        lowercase: "Coahuila",
        capital: "Coahuila",
        stores: [],
        index: 4,
    },
    {
        lowercase: "Chihuahua",
        capital: "Chihuahua",
        stores: [],
        index: 5,
    },
    {
        lowercase: "Guanajuato",
        abbreviation: "GTO",
        capital: "GUANAJUATO",
        stores: [],
        index: 6,
    },
    {
        lowercase: "Guerrero",
        capital: "Guerrero",
        stores: [],
        index: 7,
    },
    {
        lowercase: "Durango",
        capital: "Durango",
        stores: [],
        index: 8,
    },
    {
        lowercase: "Baja California",
        capital: "Baja California",
        stores: [],
        index: 9,
    },
    {
        lowercase: "Hidalgo",
        abbreviation: "HGO",
        stores: [],
        index: 10,
    },
    {
        lowercase: "Jalisco",
        capital: "Jalisco",
        stores: [],
        index: 11,
    },
    {
        lowercase: "Jalisco",
        capital: "Jalisco",
        stores: [],
        index: 12,
    },
    {
        lowercase: "Michoacán",
        capital: "Michoacán",
        stores: [],
        index: 13,
    },
    {
        lowercase: "Morelos",
        capital: "Morelos",
        stores: [],
        index: 14,
    },
    {
        lowercase: "Morelos",
        capital: "Morelos",
        stores: [],
        index: 15,
    },
    {
        lowercase: "Nuevo León",
        capital: "Nuevo León",
        stores: [],
        index: 16,
    },
    {
        lowercase: "Oaxaca",
        capital: "Oaxaca",
        stores: [],
        index: 17,
    },
    {
        lowercase: "Puebla",
        capital: "Puebla",
        stores: [],
        index: 18,
    },
    {
        lowercase: "Querétaro",
        abbreviation: "QRO",
        stores: [],
        index: 19,
    },
    {
        lowercase: "San Luis Potosí",
        capital: "San Luis Potosí",
        stores: [],
        index: 20,
    },
    {
        lowercase: "Sonora",
        capital: "Sonora",
        stores: [],
        index: 21,
    },
    {
        lowercase: "Tlaxcala",
        capital: "Tlaxcala",
        stores: [],
        index: 22,
    },
    {
        lowercase: "Veracruz",
        capital: "Veracruz",
        stores: [],
        index: 23,
    },
    {
        lowercase: "Zacatecas",
        capital: "Zacatecas",
        stores: [],
        index: 24,
    },
];

function getListCodesStates(options) {
    var listCodesState = [];
    if (options.lowercase) {
        listCodesState.push(options.lowercase);
    }
    if (options.capital) {
        listCodesState.push(options.capital);
    }
    if (options.abbreviation) {
        listCodesState.push(options.abbreviation);
    }
    return {
        listCodesState: listCodesState,
        index: options.index,
    };
}
function addStore(index, store) {
    var pos = 0;
    var stores = [];
    for (pos; pos < predefinedStores.length; pos++) {
        if (predefinedStores[pos].index === index) {
            stores = predefinedStores[index].stores;
            stores.push({
                id: store.ID,
                name: store.name,
                address: store.address1,
                city: store.city,
                state: store.stateCode,
                postalCode: store.postalCode,
                phone: store.phone,
                latitude: store.latitude,
                longitude: store.longitude,
            });
            predefinedStores[index].stores = stores;
        }
    }
}

function getStores(stores) {
    var pos = 0;
    var code = 0;
    var store = {};
    var codes = [];
    while (stores.hasNext()) {
        store = stores.next();
        for (pos = 0; pos < predefinedStores.length; pos++) {
            codes = getListCodesStates(predefinedStores[pos]);
            if (codes.listCodesState.length > 0) {
                for (code = 0; code < codes.listCodesState.length; code++) {
                    if (codes.listCodesState[code] === store.stateCode) {
                        addStore(codes.index, store);
                    }
                }
            }
        }
    }
    return predefinedStores;
}

module.exports = {
    getStores: getStores,
};
