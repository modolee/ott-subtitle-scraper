# OTT 자막 스크래퍼

- 디즈니플러스 작업하다가, 동영상 재생에 실패
- 현재는 Puppeteer를 이용해서 디즈니플러스에 접속 후, 로그인 -> 프로필 선택 -> 핀번호 입력 -> 콘텐츠 상세 페이지로 이동 까지만 구현되어 있는 상태

# 환경변수

- CHROME_EXECUTABLE_PATH: OS에 설치 된 크롬을 사용하고자 하는 경우, 크롬 실행 후 `chrome://version/` 접속, 실행 가능 경로 확인

# 디즈니 플러스

## 콘텐츠 목록 불러오기

[https://www.justwatch.com/kr/동영상서비스/disney-plus?sort_by=title](https://www.justwatch.com/kr/%EB%8F%99%EC%98%81%EC%83%81%EC%84%9C%EB%B9%84%EC%8A%A4/disney-plus?sort_by=title)

### Request

POST https://apis.justwatch.com/graphql

Content-Type: application/json

```json
{
  "operationName": "GetPopularTitles",
  "variables": {
    "first": 40,
    "platform": "WEB",
    "popularTitlesSortBy": "ALPHABETICAL",
    "sortRandomSeed": 0,
    "popularAfterCursor": "NDA=",
    "popularTitlesFilter": {
      "ageCertifications": [],
      "excludeGenres": [],
      "excludeProductionCountries": [],
      "genres": [],
      "objectTypes": [],
      "productionCountries": [],
      "packages": ["dnp"],
      "excludeIrrelevantTitles": false,
      "presentationTypes": [],
      "monetizationTypes": []
    },
    "watchNowFilter": {
      "packages": ["dnp"],
      "monetizationTypes": []
    },
    "language": "ko",
    "country": "KR",
    "allowSponsoredRecommendations": {
      "country": "KR",
      "platform": "WEB",
      "pageType": "VIEW_POPULAR",
      "language": "ko"
    }
  },
  "query": "query GetPopularTitles($allowSponsoredRecommendations: SponsoredRecommendationsInput, $backdropProfile: BackdropProfile, $country: Country!, $first: Int! = 40, $format: ImageFormat, $language: Language!, $platform: Platform! = WEB, $popularAfterCursor: String, $popularTitlesFilter: TitleFilter, $popularTitlesSortBy: PopularTitlesSorting! = POPULAR, $profile: PosterProfile, $sortRandomSeed: Int! = 0, $watchNowFilter: WatchNowOfferFilter!) {\n  popularTitles(\n    after: $popularAfterCursor\n    allowSponsoredRecommendations: $allowSponsoredRecommendations\n    country: $country\n    filter: $popularTitlesFilter\n    first: $first\n    sortBy: $popularTitlesSortBy\n    sortRandomSeed: $sortRandomSeed\n  ) {\n    edges {\n      ...PopularTitleGraphql\n      __typename\n    }\n    pageInfo {\n      startCursor\n      endCursor\n      hasPreviousPage\n      hasNextPage\n      __typename\n    }\n    sponsoredAd {\n      ...SponsoredAdFragment\n      __typename\n    }\n    totalCount\n    __typename\n  }\n}\n\nfragment PopularTitleGraphql on PopularTitlesEdge {\n  cursor\n  node {\n    id\n    objectId\n    objectType\n    content(country: $country, language: $language) {\n      title\n      fullPath\n      scoring {\n        imdbScore\n        __typename\n      }\n      posterUrl(profile: $profile, format: $format)\n      ... on ShowContent {\n        backdrops(profile: $backdropProfile, format: $format) {\n          backdropUrl\n          __typename\n        }\n        __typename\n      }\n      isReleased\n      __typename\n    }\n    likelistEntry {\n      createdAt\n      __typename\n    }\n    dislikelistEntry {\n      createdAt\n      __typename\n    }\n    watchlistEntry {\n      createdAt\n      __typename\n    }\n    watchNowOffer(country: $country, platform: $platform, filter: $watchNowFilter) {\n      id\n      standardWebURL\n      package {\n        id\n        packageId\n        clearName\n        __typename\n      }\n      retailPrice(language: $language)\n      retailPriceValue\n      lastChangeRetailPriceValue\n      currency\n      presentationType\n      monetizationType\n      availableTo\n      __typename\n    }\n    ... on Movie {\n      seenlistEntry {\n        createdAt\n        __typename\n      }\n      __typename\n    }\n    ... on Show {\n      seenState(country: $country) {\n        seenEpisodeCount\n        progress\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SponsoredAdFragment on SponsoredRecommendationAd {\n  bidId\n  campaign {\n    externalTrackers {\n      type\n      data\n      __typename\n    }\n    hideRatings\n    promotionalImageUrl\n    watchNowLabel\n    watchNowOffer {\n      standardWebURL\n      presentationType\n      monetizationType\n      package {\n        id\n        packageId\n        shortName\n        clearName\n        icon\n        __typename\n      }\n      __typename\n    }\n    node {\n      id\n      ... on MovieOrShow {\n        content(country: $country, language: $language) {\n          fullPath\n          posterUrl\n          title\n          originalReleaseYear\n          scoring {\n            imdbScore\n            __typename\n          }\n          externalIds {\n            imdbId\n            __typename\n          }\n          backdrops(format: $format, profile: $backdropProfile) {\n            backdropUrl\n            __typename\n          }\n          isReleased\n          __typename\n        }\n        objectId\n        objectType\n        offers(country: $country, platform: $platform) {\n          monetizationType\n          presentationType\n          package {\n            id\n            packageId\n            __typename\n          }\n          id\n          __typename\n        }\n        watchlistEntry {\n          createdAt\n          __typename\n        }\n        __typename\n      }\n      ... on Show {\n        seenState(country: $country) {\n          seenEpisodeCount\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  holdoutGroup\n  __typename\n}\n"
}
```

### Response

- data.popularTitles.pageInfo.endCursor 를 가지고 다음 페이지를 부를 수 있다.
- data.popularTitles.edges[i].node.watchNowOffer.standardWebURL 에서 필요한 부분만 파싱해야 됨 → `decodeURIComponent("standardWebURL").split("?u=")[1].split("&subId3=)[0]`
- https://disneyplus.bn5x.net/c/1206980/705874/9358?u=https%3A%2F%2Fwww.disneyplus.com%2Fseries%2Fthe-good-doctor%2F2eEfKJDOVOv2&subId3=justappsvod

```json
{
  "data": {
    "popularTitles": {
      "edges": [
        {
          "cursor": "MTIx",
          "node": {
            "id": "ts57118",
            "objectId": 57118,
            "objectType": "SHOW",
            "content": {
              "title": "굿 닥터",
              "fullPath": "/kr/TV-프로그램/gus-dagteo",
              "scoring": {
                "imdbScore": 8,
                "__typename": "Scoring"
              },
              "posterUrl": "/poster/300727661/{profile}/gus-dagteo.{format}",
              "backdrops": [
                {
                  "backdropUrl": "/backdrop/300727663/{profile}/gus-dagteo.{format}",
                  "__typename": "Backdrop"
                },
                {
                  "backdropUrl": "/backdrop/246660378/{profile}/gus-dagteo.{format}",
                  "__typename": "Backdrop"
                },
                {
                  "backdropUrl": "/backdrop/303442069/{profile}/gus-dagteo.{format}",
                  "__typename": "Backdrop"
                },
                {
                  "backdropUrl": "/backdrop/303442068/{profile}/gus-dagteo.{format}",
                  "__typename": "Backdrop"
                },
                {
                  "backdropUrl": "/backdrop/291229569/{profile}/gus-dagteo.{format}",
                  "__typename": "Backdrop"
                }
              ],
              "__typename": "ShowContent",
              "isReleased": true
            },
            "likelistEntry": null,
            "dislikelistEntry": null,
            "watchlistEntry": null,
            "watchNowOffer": {
              "id": "b2Z8dHM1NzExODpLUjozMzc6ZmxhdHJhdGU6aGQ=",
              "standardWebURL": "https://disneyplus.bn5x.net/c/1206980/705874/9358?u=https%3A%2F%2Fwww.disneyplus.com%2Fseries%2Fthe-good-doctor%2F2eEfKJDOVOv2&subId3=justappsvod",
              "package": {
                "id": "cGF8MzM3",
                "packageId": 337,
                "clearName": "Disney Plus",
                "__typename": "Package"
              },
              "retailPrice": null,
              "retailPriceValue": null,
              "lastChangeRetailPriceValue": null,
              "currency": "KRW",
              "presentationType": "HD",
              "monetizationType": "FLATRATE",
              "availableTo": null,
              "__typename": "Offer"
            },
            "seenState": {
              "seenEpisodeCount": 0,
              "progress": 0,
              "__typename": "ShowSeenState"
            },
            "__typename": "Show"
          },
          "__typename": "PopularTitlesEdge"
        },
        {
          "cursor": "MTIy",
          "node": {
            "id": "tm160178",
            "objectId": 160178,
            "objectType": "MOVIE",
            "content": {
              "title": "굿 럭 찰리, 잇츠 크리스마스!",
              "fullPath": "/kr/영화/good-luck-charlie-its-christmas",
              "scoring": {
                "imdbScore": 6.3,
                "__typename": "Scoring"
              },
              "posterUrl": "/poster/238013291/{profile}/good-luck-charlie-its-christmas.{format}",
              "isReleased": true,
              "__typename": "MovieContent"
            },
            "likelistEntry": null,
            "dislikelistEntry": null,
            "watchlistEntry": null,
            "watchNowOffer": {
              "id": "b2Z8dG0xNjAxNzg6S1I6MzM3OmZsYXRyYXRlOmhk",
              "standardWebURL": "https://disneyplus.bn5x.net/c/1206980/705874/9358?u=https%3A%2F%2Fwww.disneyplus.com%2Fmovies%2Fgood-luck-charlie-its-christmas%2F4DkUHMfCgHCL&subId3=justappsvod",
              "package": {
                "id": "cGF8MzM3",
                "packageId": 337,
                "clearName": "Disney Plus",
                "__typename": "Package"
              },
              "retailPrice": null,
              "retailPriceValue": null,
              "lastChangeRetailPriceValue": null,
              "currency": "KRW",
              "presentationType": "HD",
              "monetizationType": "FLATRATE",
              "availableTo": null,
              "__typename": "Offer"
            },
            "seenlistEntry": null,
            "__typename": "Movie"
          },
          "__typename": "PopularTitlesEdge"
        }
      ],
      "pageInfo": {
        "startCursor": "MTIx",
        "endCursor": "MTIy",
        "hasPreviousPage": true,
        "hasNextPage": true,
        "__typename": "PageInfo"
      },
      "sponsoredAd": null,
      "totalCount": 1997,
      "__typename": "PopularTitlesConnection"
    }
  }
}
```

## 콘텐츠 페이지 렌더 후 자막 다운로드

- 위에서 콘텐츠 페이지 주소를 수집한 후에 순차적으로 방문하면서, 해당 페이지에서 아래 코드를 변환하여 자막을 다운로드
- https://greasyfork.org/en/scripts/404223-disney-subtitles-downloader

- 하지만 Puppeteer를 이용해서 접속하면, 영상이 재생되지 않음
  - 내장 Chrome을 이용하면 아예 재생이 되지 않고, PC에 설치 된 Chrome을 이용할 경우 83 에러가 발생함
