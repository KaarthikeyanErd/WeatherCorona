if ("geolocation" in navigator) {

    console.log("Geolocation available YAY");
    navigator.geolocation.getCurrentPosition(async position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        let api_key, weather, district, state, active_case;
        try {
            console.log("Lati=", latitude);
            console.log("Alti=", longitude);
            document.getElementById("latitude").textContent = latitude;
            document.getElementById("longitude").textContent = longitude;
        } catch (err) {
            console.log("Error on geolocation", err);
        }

        try {
            let key = await fetch("/key");
            api_key = await key.json();
            document.getElementById("api").textContent = api_key;
            console.log(api_key);
        } catch (err) {
            console.log("Error on key", err);
        }

        try {
            //let url=`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`;
            let waether_url = `weather/${latitude},${longitude},${api_key}`;
            const initial = await fetch(waether_url);
            weather = await initial.json();
            const humidity = weather.main.humidity;
            const area = weather.name;
            document.getElementById("humidity").textContent = weather.main.humidity;
            document.getElementById("area").textContent = weather.name;
        } catch (err) {
            console.log("Error on weather", err);
        }

        try {
            //`https://api.thevirustracker.com/free-api?countryTimeline=${country_code}`;
            let country_code = weather.sys.country;
            let corona_url = `case/${country_code}`;
            let today = new Date();
            let month = String(today.getMonth() + 1);
            let date = String(today.getDate() - 1).padStart(2, "0");
            let year = String(today.getFullYear());
            let req_date = (month + "/" + date + "/" + year.substr(-2)).trim();

            const count = await fetch(corona_url);
            const corona = await count.json();
            document.getElementById("count").textContent =
                corona.timelineitems[0][req_date].total_cases;
            document.getElementById("Country").textContent =
                corona.countrytimelinedata[0].info.title;
            document.getElementById("new_cases").textContent =
                corona.timelineitems[0][req_date].new_daily_cases;
        } catch (err) {
            console.log("Error on country case", err);
        }


        try {
            //let url2=`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=8ab01065063848469ed7983e2b8ef7af`
            let dis_state_url = `dis_state/${latitude},${longitude}`;
            const location = await fetch(dis_state_url);
            const districts = await location.json();
            district = districts.results[0].components.state_district.split(" ");
            if (district[0] == "Tiruchchirappalli") {
                district = "Tiruchirappalli";
                state = districts.results[0].components.state;
                document.getElementById("district").textContent = district;
                document.getElementById("state").textContent = state;
            } else {
                state = districts.results[0].components.state;
                district = district[0];
                document.getElementById("district").textContent = district;
                document.getElementById("state").textContent = state;
            }
        } catch (err) {
            console.log("Error on district", err);
        }

        try {
            //state_url= `https://api.covid19india.org/state_district_wise.json`;
            let state_case = `state_case/${district},${state}`;
            const inner_location = await fetch(state_case);
            const dis_corona = await inner_location.json();
            active_case = dis_corona[state].districtData[district].active;
            document.getElementById("active cases").textContent = active_case;
            console.log(active_case);
        } catch (err) {
            console.log("Error on state case", err);
        }

        try {
            const data = {
                latitude,
                longitude,
                api_key,
                humidity,
                area,
                district,
                state,
                active_case
            };
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            };
            const response = await fetch("/location", options);
            const json = await response.json();
            console.log(json);
        } catch (err) {
            console.log("Error on database", err);
        }
    });
} else {
    console.log("Geolocation not available");
}
