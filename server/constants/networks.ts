export class Network {
  displayName: string;
  providerKeys: string[];
  searchUrl: string;

  constructor(displayName: string, providerKeys: string[], searchUrl: string) {
    this.displayName = displayName;
    this.providerKeys = providerKeys;
    this.searchUrl = searchUrl;
  }
}

// TODO: Add more networks and find search URLs
// These URLs are also regionalised so it's a bit hacky
export const Networks = {
  netflix: new Network(
    'Netflix',
    ['Netflix', 'Netflix basic with Ads'],
    'https://www.netflix.com/search?q='
  ),
  primeVideo: new Network(
    'Prime Video',
    ['Amazon Prime Video'],
    'https://www.amazon.co.uk/s?i=instant-video&k='
  ),
  appleTv: new Network('Apple TV Plus', ['Apple TV Plus'], 'TODO'),
  disneyPlus: new Network('Disney Plus', ['Disney Plus'], 'TODO'),
  hulu: new Network('Hulu', ['Hulu'], 'TODO'),
  hbo: new Network('HBO', ['HBO Max'], 'TODO'),
};
