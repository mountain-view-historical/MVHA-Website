# Mountain View Historical Association — photographs held nowhere else

Made by `tools/export-photos.js` on 2026-09-09.

## What this is

The Association's photographs fall into two groups.

**The large group is safe.** About thirteen hundred photographs were digitised
through California Revealed and are held permanently at the Internet Archive,
in two collections — the City of Mountain View Public Library's, and the
Association's own. The website does not store copies of those: it shows the
Internet Archive's thumbnail and links to the item. They are catalogued in
`data/photos-ia.json`.

**This package is the other group.** 60 pictures that the website
loads from the old WordPress server at mountainviewhistorical.org and that are
*not* in the Internet Archive listing. If that server is ever switched off,
these are the ones that disappear.

They are of two sorts:

- **54 photographs** (in `photographs/`) — the Association's own
  pictures, shown on the Photographs page and in the band across the top of
  the home page.
- **6 pictures used inside pages** (in `page-pictures/`) — event
  flyers, article illustrations, the logo and similar.

`catalogue.csv` lists everything in one table, which is the easier form if
you are filling in an upload form or a spreadsheet.

## Before uploading any of these to the Internet Archive

A few things are worth checking first, because none of them can be settled
from the website's own files:

1. **Who owns each photograph.** The website records where a picture is used,
   not where it came from, so for most of these the answer simply is not
   written down anywhere. The Association can only give away rights it holds,
   and the Internet Archive upload form asks.

2. **Marked as somebody else's.** Do not upload these without asking the
   owner first:

   - **Castro Station** — Image source: wx4.org

3. **Credited to a named photographer.** A photograph belongs to whoever took
   it unless they have signed it over, so these need a word with the
   photographer — usually a short email is enough:

   - **A wall of family photos** — Photo by Anna Hoch-Kenney
   - **Lloyd Lettis** — Photo by Anna Hoch-Kenney
   - **Lloyd Lettis at 104** — Photo by Anna Hoch-Kenney

4. **4 share a title with something already in the Internet
   Archive listing**, so they may be copies of something already there:

   - Castro Street
   - Castro Street
   - Hangar One
   - Moffett Field

The Association already has its own Internet Archive collection
(`mountain-view-historical-association`), so anything uploaded can go there
rather than into the general pool.

---

# The photographs

### 200 Block of Castro Street

- **File**: `photographs/castro-flags.jpg`
- **Date**: circa 1949
- **Used on**: Home page slider (data/slider.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2022/11/castro-flags.jpg

### 201 Castro Street, then and now

- **File**: `photographs/e-c.-1905-building-at-201-Castro-then-and-now..png`
- **Date**: circa 1905 and today
- **Topic**: Castro Street & downtown
- **Description**: A c. 1905 commercial building at 201 Castro Street compared with the same corner in the present day.
- **Used on**: Photographs page (data/photos.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2018/06/e-c.-1905-building-at-201-Castro-then-and-now..png

### A Mountain View residence

- **File**: `photographs/14-1024x645.jpg`
- **Date**: early 20th century
- **Topic**: People & portraits
- **Description**: Postcard showing a Mountain View residence, believed to be in Castro City.
- **Used on**: Photographs page (data/photos.json), castro-legacy.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2019/09/14-1024x645.jpg

### A wall of family photos

- **File**: `photographs/MVHA-Oldest-Resident-1024x684.jpg`
- **Date**: October 2024
- **Topic**: People & portraits
- **Description**: A sparkling '104' sign sits on the counter underneath a wall of family photos in Lloyd Lettis's Mountain View home.
- **Credit**: Photo by Anna Hoch-Kenney
- **Used on**: Photographs page (data/photos.json), oldest-resident.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2022/10/MVHA-Oldest-Resident-1024x684.jpg

### An early MVHA meeting

- **File**: `photographs/1960s-MVHA-Meeting_Adobe_Building.jpg`
- **Date**: circa 1960
- **Topic**: Association history
- **Description**: An early meeting of the Mountain View Pioneer and Historical Association at the Adobe Building.
- **Used on**: Photographs page (data/photos.json), index.html, our-history.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2019/09/1960s-MVHA-Meeting_Adobe_Building.jpg

### Bayshore Highway (US 101)

- **File**: `photographs/hwy101.jpg`
- **Date**: circa 1957
- **Used on**: Home page slider (data/slider.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2022/11/hwy101.jpg

### Bob Gurr speaks at the MVHA summer BBQ

- **File**: `photographs/Mountain-View-Historical-Association-Gathering.jpg`
- **Date**: 2016
- **Topic**: Association history
- **Description**: Original Disneyland Imagineer Bob Gurr speaks at the MVHA's 2016 summer BBQ at the Adobe Building, on his work with Mountain View's Arrow Development.
- **Used on**: Photographs page (data/photos.json), events.html, our-history.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2018/06/Mountain-View-Historical-Association-Gathering.jpg

### Castro and California Streets

- **File**: `photographs/castro-1960-1.jpg`
- **Date**: circa 1960
- **Used on**: Home page slider (data/slider.json), index.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2022/11/castro-1960-1.jpg

### Castro City Market

- **File**: `photographs/16.jpg`
- **Date**: 20th century
- **Topic**: People & portraits
- **Description**: The Castro City Market and gas station, run by the Nakamura family, was a neighbourhood landmark until 1992. The building is now home to La Plaza Market.
- **Used on**: Photographs page (data/photos.json), castro-legacy.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2019/09/16.jpg

### Castro Station

- **File**: `photographs/Castro-Station-Depot-Not-MVHA-Photo.jpg`
- **Date**: circa 1974
- **Topic**: Transport
- **Description**: Castro Station looking north toward Rengstorff Avenue. Originally a flag stop granted to the Castro family in compensation for the railroad crossing their rancho.
- **Credit**: Image source: wx4.org
- **Used on**: Photographs page (data/photos.json), castro-legacy.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2019/09/Castro-Station-Depot-Not-MVHA-Photo.jpg

### Castro Street

- **File**: `photographs/Downtown-Mountain-Views-Castro-Street-in-1953.jpg`
- **Date**: circa 1953
- **Topic**: Castro Street & downtown
- **Description**: Looking down downtown Mountain View's main street in the early 1950s, lined with neon signs and four lanes of traffic.
- **Note**: a photograph with this title is already in the Internet Archive listing — check before uploading.
- **Used on**: Photographs page (data/photos.json), Home page slider (data/slider.json), archive.html, directories.html, history.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2018/06/Downtown-Mountain-Views-Castro-Street-in-1953.jpg

### Castro Street

- **File**: `photographs/Castro-Street_1970_MVHC.jpg`
- **Date**: 1970
- **Topic**: Castro Street & downtown
- **Description**: Castro Street before the 1988–1990 downtown revitalization narrowed it to two lanes and widened the sidewalks.
- **Note**: a photograph with this title is already in the Internet Archive listing — check before uploading.
- **Used on**: Photographs page (data/photos.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2020/07/Castro-Street_1970_MVHC.jpg

### Crisanto Castro

- **File**: `photographs/5A.jpg`
- **Date**: 19th century
- **Topic**: Castro family
- **Description**: After his father Mariano's death in 1856, Crisanto Castro continued to live on the rancho with his widowed mother Maria Trinidad Peralta and his unmarried sisters.
- **Used on**: Photographs page (data/photos.json), castro-legacy.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2019/09/5A.jpg

### Dedication of the Castro Adobe historic marker

- **File**: `photographs/1959-MVHA_Castro_Adobe_Placard-Fr-Doyle_Mercedes-Castro-713x1024.jpg`
- **Date**: May 3, 1959
- **Topic**: Association history
- **Description**: Reverend Father James Doyle and Mercedes Castro at the dedication of a placard marking the site of the first Estrada/Castro adobe, at Central Expressway and Rengstorff Avenue.
- **Used on**: Photographs page (data/photos.json), castro-legacy.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2019/09/1959-MVHA_Castro_Adobe_Placard-Fr-Doyle_Mercedes-Castro-713x1024.jpg

### Eagle monument dedication

- **File**: `photographs/PXL_20231216_193332065-compressed-1024x563.jpg`
- **Date**: December 16, 2023
- **Topic**: Association history
- **Description**: MVHA President Pamela Baird welcomes the crowd gathered in Eagle Park for the dedication of the Mountain View High School monument.
- **Used on**: Photographs page (data/photos.json), eagle-monument.html, history.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2024/03/PXL_20231216_193332065-compressed-1024x563.jpg

### Escuela Avenue School

- **File**: `photographs/17.jpg`
- **Date**: opened 1948
- **Topic**: Streets & buildings
- **Description**: Now named Mariano Castro Elementary School. Renamed in 1959 after residents pointed out that 'Escuela Avenue School' translated to 'School Avenue School'.
- **Used on**: Photographs page (data/photos.json), castro-legacy.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2019/09/17.jpg

### Farming in the North Bayshore

- **File**: `photographs/moffet-field-farm.jpg`
- **Date**: circa 1987
- **Used on**: Home page slider (data/slider.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2022/11/moffet-field-farm.jpg

### Five of the Castro children as adults

- **File**: `photographs/8.jpg`
- **Date**: early 20th century
- **Topic**: Castro family
- **Description**: From left to right: Joe Castro, Susan Castro, Andrew Castro, Mercedes Castro, and Frank Castro.
- **Used on**: Photographs page (data/photos.json), castro-legacy.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2019/09/8.jpg

### Francisca Armijo Castro

- **File**: `photographs/5B.jpg`
- **Date**: 19th century
- **Topic**: Castro family
- **Description**: In 1857, Crisanto married Francisca Armijo. The couple and their children played a prominent role in the early development of Mountain View.
- **Used on**: Photographs page (data/photos.json), castro-legacy.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2019/09/5B.jpg

### Hangar One

- **File**: `photographs/Hanger-one-hanger-1-e1594691504749-1024x821.jpg`
- **Date**: built 1931
- **Topic**: Streets & buildings
- **Description**: One of the world's largest freestanding structures, covering eight acres, built to house the airship USS Macon.
- **Note**: a photograph with this title is already in the Internet Archive listing — check before uploading.
- **Used on**: Photographs page (data/photos.json), landmarks.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2020/07/Hanger-one-hanger-1-e1594691504749-1024x821.jpg

### Interpretive sign at Eagle Park

- **File**: `photographs/PXL_20231217_152521801-compressed-1024x771.jpg`
- **Date**: December 2023
- **Topic**: Association history
- **Description**: The sign at the base of the eagle sculpture explains the history of Mountain View High School and how its 1975 football championship brought the city's diverse population together.
- **Used on**: Photographs page (data/photos.json), eagle-monument.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2024/03/PXL_20231217_152521801-compressed-1024x771.jpg

### Interpretive sign at Rengstorff Park

- **File**: `photographs/IMG_2057.jpeg`
- **Date**: present day
- **Topic**: Castro family
- **Description**: A sign near the BBQ area describing the park's connection to the Castro family, including a small map of their rancho.
- **Used on**: Photographs page (data/photos.json), castro-legacy.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2019/09/IMG_2057.jpeg

### Lloyd Lettis

- **File**: `photographs/lloyd-lettis-1.jpg`
- **Date**: October 11, 2024
- **Topic**: People & portraits
- **Description**: Lloyd Lettis laughs during a conversation at his home in Mountain View.
- **Credit**: Photo by Anna Hoch-Kenney
- **Used on**: Photographs page (data/photos.json), oldest-resident.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2022/10/lloyd-lettis-1.jpg

### Lloyd Lettis at 104

- **File**: `photographs/lloyd-lettis-2-1024x683.jpg`
- **Date**: October 2024
- **Topic**: People & portraits
- **Description**: Lloyd Lettis, honoured by the MVHA as Mountain View's oldest living resident, at home in the house he bought for just under $13,000 in 1952.
- **Credit**: Photo by Anna Hoch-Kenney
- **Used on**: Photographs page (data/photos.json), oldest-resident.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2022/10/lloyd-lettis-2-1024x683.jpg

### Mancini Motors Globe Tower

- **File**: `photographs/castro-st-globe.jpg`
- **Date**: El Camino Real and Castro Street, 1940–1974
- **Used on**: Home page slider (data/slider.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2022/11/castro-st-globe.jpg

### Mayfield Mall

- **File**: `photographs/Mall.png`
- **Date**: circa 1966
- **Topic**: Streets & buildings
- **Description**: One of the first fully enclosed, carpeted shopping malls in Northern California, at Central Expressway and San Antonio Road. Closed in 1983.
- **Used on**: Photographs page (data/photos.json), Home page slider (data/slider.json), history.html, index.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2018/06/Mall.png

### Moffett Field

- **File**: `photographs/Moffet-Air-Field-1024x682.png`
- **Date**: commissioned 1933
- **Topic**: Streets & buildings
- **Description**: Built on land granted in 1844 as Rancho Posolmi to Lope Yñigo, an Ohlone man. Local residents bought 1,000 acres and sold it to the Navy for one dollar.
- **Note**: a photograph with this title is already in the Internet Archive listing — check before uploading.
- **Used on**: Photographs page (data/photos.json), landmarks.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2020/07/Moffet-Air-Field-1024x682.png

### Mountain View City Hall

- **File**: `photographs/old-city-hall.jpg`
- **Date**: Castro and California Streets, 1910–1962
- **Used on**: Home page slider (data/slider.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2022/11/old-city-hall.jpg

### Mountain View city limit sign

- **File**: `photographs/MV-City-Limit-Sign-1960s.png`
- **Date**: 1960s
- **Topic**: People & portraits
- **Description**: A city limit sign from the decade when Mountain View's population and boundaries were expanding rapidly.
- **Used on**: Photographs page (data/photos.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2018/06/MV-City-Limit-Sign-1960s.png

### Mountain View High School

- **File**: `photographs/Mountain-VIew-High-School.png`
- **Date**: Castro Street campus, 1924–1981
- **Topic**: Streets & buildings
- **Description**: The Castro Street campus of Mountain View Union High School, home of the Eagles. Demolished in 1987; the site is now Eagle Park, Park Place and City Centre.
- **Used on**: Photographs page (data/photos.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2018/06/Mountain-VIew-High-School.png

### Mountain View in 1954

- **File**: `photographs/Mountain-View-1954.png`
- **Date**: 1954
- **Topic**: People & portraits
- **Description**: Mountain View in the year the Historical Association was founded, as orchards began giving way to subdivisions.
- **Used on**: Photographs page (data/photos.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2018/06/Mountain-View-1954.png

### Mountain View Station Depot

- **File**: `photographs/Mountain-View-Station.png`
- **Date**: built circa 1888
- **Topic**: Transport
- **Description**: The Southern Pacific depot that gave New Mountain View its name. Demolished in 1959; a replica was built at Centennial Plaza in 2002.
- **Used on**: Photographs page (data/photos.json), Home page slider (data/slider.json), 11 pages across the site
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2018/06/Mountain-View-Station.png

### Mountain View Water Tower

- **File**: `photographs/mv-water-tower.jpg`
- **Date**: Grant Road and Cuesta Avenue, 1953–1987
- **Used on**: Home page slider (data/slider.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2022/11/mv-water-tower.jpg

### Mtn. View Fire Station

- **File**: `photographs/old-fire-station.jpg`
- **Date**: Franklin Street location, 1924–1953
- **Used on**: Home page slider (data/slider.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2022/11/old-fire-station.jpg

### MVHA at the Santa Clara County Fair

- **File**: `photographs/Exibit-volunteer.jpg`
- **Date**: 2013
- **Topic**: Association history
- **Description**: An Association volunteer staffing the MVHA exhibit at the Santa Clara County Fair.
- **Used on**: Photographs page (data/photos.json), join.html, volunteer.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2018/06/Exibit-volunteer.jpg

### MVHA board meeting at the History Center

- **File**: `photographs/Mountain-View-Historic-Association-Board-members.jpg`
- **Date**: 2015
- **Topic**: Association history
- **Description**: Board members at the Mountain View History Center on the second floor of the Mountain View Public Library.
- **Used on**: Photographs page (data/photos.json), about.html, history-center.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2018/06/Mountain-View-Historic-Association-Board-members.jpg

### MVHA in the community

- **File**: `photographs/12990858_992019684217247_1409738173237841568_n.jpg`
- **Date**: 2016
- **Topic**: Association history
- **Description**: Association volunteers sharing Mountain View history at a local community event.
- **Used on**: Photographs page (data/photos.json), links.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2018/05/12990858_992019684217247_1409738173237841568_n.jpg

### Rengstorff Avenue

- **File**: `photographs/10.jpg`
- **Date**: 1966
- **Topic**: Castro Street & downtown
- **Description**: Rengstorff Avenue showing Rengstorff Park on the left and the Castro City neighbourhood on the right.
- **Used on**: Photographs page (data/photos.json), castro-legacy.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2019/09/10.jpg

### Rengstorff Avenue & Old Middlefield Road

- **File**: `photographs/rengstorff-omiddlefield.jpg`
- **Date**: circa 1960
- **Used on**: Home page slider (data/slider.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2022/11/rengstorff-omiddlefield.jpg

### Rengstorff Park BBQ area

- **File**: `photographs/19.jpg`
- **Date**: present day
- **Topic**: Castro family
- **Description**: A group of mature eucalyptus and oak trees marks the spot where Villa Francisca once stood. The eucalyptus were likely planted by the Castro family.
- **Used on**: Photographs page (data/photos.json), castro-legacy.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2019/09/19.jpg

### Richard McDonald and Daniel Burke

- **File**: `photographs/Richard-McDonald-and-Daniel-Burke-1906.png`
- **Date**: 1906
- **Topic**: People & portraits
- **Description**: Two Mountain View residents photographed in the year of the San Francisco earthquake.
- **Used on**: Photographs page (data/photos.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2018/06/Richard-McDonald-and-Daniel-Burke-1906.png

### Richard McDonald and Daniel Burke, ice delivery

- **File**: `photographs/Richard-McDonald-and-Daniel-Burke-Ice-1919.png`
- **Date**: 1919
- **Topic**: People & portraits
- **Description**: Delivering ice in Mountain View, a decade before mechanical refrigeration became common in local homes.
- **Used on**: Photographs page (data/photos.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2018/06/Richard-McDonald-and-Daniel-Burke-Ice-1919.png

### The Adobe Building today

- **File**: `photographs/1200px-2009-0723-CA-MtnViewAdobe.jpg`
- **Date**: 2009
- **Topic**: Streets & buildings
- **Description**: The restored Adobe Building at 157 Moffett Boulevard, home to most of the Association's quarterly meetings.
- **Used on**: Photographs page (data/photos.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2018/05/1200px-2009-0723-CA-MtnViewAdobe.jpg

### The Castro children at Villa Francisca

- **File**: `photographs/6.jpg`
- **Date**: circa 1911
- **Topic**: Castro family
- **Description**: Susan Castro, Crisanto IV Castro, Mercedes Castro and, at back, Frank 'Pancho' Castro in front of Villa Francisca, built in 1911 and named in honour of their mother, Francisca.
- **Used on**: Photographs page (data/photos.json), castro-legacy.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2019/09/6.jpg

### The Castro family adobe

- **File**: `photographs/Castro-Adobe.jpg`
- **Date**: circa 1850
- **Topic**: Castro family
- **Description**: Mariano Castro's house, which combined adobe and wood construction and featured a large west-facing porch. It replaced the smaller Estrada adobe of the early 1840s.
- **Used on**: Photographs page (data/photos.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2019/09/Castro-Adobe.jpg

### The Eagle has landed

- **File**: `photographs/PXL_20231217_152512143-compressed-771x1024.jpg`
- **Date**: December 2023
- **Topic**: Association history
- **Description**: A bronze sculpture of an eagle mounted to the top of the new monument at Eagle Park, honouring the 1975 Mountain View High School CCS championship football team.
- **Used on**: Photographs page (data/photos.json), eagle-monument.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2024/03/PXL_20231217_152512143-compressed-771x1024.jpg

### The Historic Adobe Building

- **File**: `photographs/Historic-Adobe-Building-1024x683.jpg`
- **Date**: built 1934, restored 2001
- **Topic**: Streets & buildings
- **Description**: Built by New Deal work-relief laborers from adobe bricks made on site. Saved from demolition by the MVHA's Save the Adobe campaign and now on the National Register of Historic Places.
- **Used on**: Photographs page (data/photos.json), landmarks.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2020/07/Historic-Adobe-Building-1024x683.jpg

### The Historic Adobe Building

- **File**: `photographs/MtnViewAdobe-bw.jpg`
- **Date**: built in 1934, restored in 2001
- **Used on**: Home page slider (data/slider.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2022/10/MtnViewAdobe-bw.jpg

### The Mountain View Theater

- **File**: `photographs/view-theatre.jpg`
- **Date**: grand reopening in 1962
- **Used on**: Home page slider (data/slider.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2022/11/view-theatre.jpg

### The National Hotel

- **File**: `photographs/national_hotel_o.jpg`
- **Date**: early 1900s
- **Topic**: Streets & buildings
- **Description**: An early Mountain View hotel from the town's first decades as an incorporated city.
- **Used on**: Photographs page (data/photos.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2018/06/national_hotel_o.jpg

### The Rengstorff House

- **File**: `photographs/Rengstorff-house-1024x834.png`
- **Date**: built 1867
- **Topic**: Streets & buildings
- **Description**: The oldest structure still standing in Mountain View, built by German immigrant Henry Rengstorff. Relocated to Shoreline Park and opened to the public in 1991.
- **Used on**: Photographs page (data/photos.json), history.html, index.html, landmarks.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2020/07/Rengstorff-house-1024x834.png

### The Weilheimer General Store

- **File**: `photographs/The-Weilheimer-General-Store-Building-is-the-oldest-1874.png`
- **Date**: built circa 1874, 124 Castro Street
- **Used on**: Home page slider (data/slider.json)
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2018/06/The-Weilheimer-General-Store-Building-is-the-oldest-1874.png

### Villa Francisca

- **File**: `photographs/9-1024x682.jpg`
- **Date**: circa 1960
- **Topic**: Castro family
- **Description**: The Castro family's Mission-style home shortly before a suspicious 1961 fire led the city to demolish it rather than repair the damage.
- **Used on**: Photographs page (data/photos.json), castro-legacy.html, history.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2019/09/9-1024x682.jpg

### Villa Lands of Mountain View

- **File**: `photographs/Villa-Lands-of-Mountain-View.jpg`
- **Date**: 1876
- **Topic**: Maps & documents
- **Description**: An 1876 map of the 'Villa Lands of Mountain View', showing parcels sold off from the Castro family's Rancho Pastoria de las Borregas.
- **Used on**: Photographs page (data/photos.json), castro-legacy.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2019/09/Villa-Lands-of-Mountain-View.jpg

---

# Pictures used inside pages

### MVHA-Logo-300x300.jpg

- **File**: `page-pictures/MVHA-Logo-300x300.jpg`
- **Used on**: 28 pages across the site
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2018/06/MVHA-Logo-300x300.jpg

### Join-us-Color.png

- **File**: `page-pictures/Join-us-Color.png`
- **Used on**: join.html, membership.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2018/06/Join-us-Color.png

### review-text.png

- **File**: `page-pictures/review-text.png`
- **Used on**: newsletters.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2022/10/review-text.png

### Cover of the Summer 2026 issue of The Mountain ReView

- **File**: `page-pictures/Mountain-ReView-Summer-2026-Newsletter.jpg`
- **Used on**: newsletters.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2026/07/Mountain-ReView-Summer-2026-Newsletter.jpg

### Eagle Up banner for the Castro Street MVHS monument campaign

- **File**: `page-pictures/Eagle-Up-banner-1-1024x410.jpeg`
- **Used on**: donate.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2022/10/Eagle-Up-banner-1-1024x410.jpeg

### The Castro family adobe, circa 1850

- **File**: `page-pictures/Castro-Adobe-1024x575.jpg`
- **Used on**: castro-legacy.html, history.html, index.html
- **Was at**: https://www.mountainviewhistorical.org/wp-content/uploads/2019/09/Castro-Adobe-1024x575.jpg
