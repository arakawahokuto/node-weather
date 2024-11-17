const weatherResult = document.getElementById("js-weather-result");

document.getElementById("js-search-btn").addEventListener("click", () => {
	const city = document.getElementById("js-city-input").value;
	if (!city) {
		alert("都市名を入力して下さい");
		return;
	}

	fetch(`/weather?city=${city}`)
	.then(response => {
		if (!response.ok) {
			return response.json().then(errorData => {
				throw new Error(errorData.error);
			});
		}
			return response.json();
		})
	.then(data => {
		if (data.error) {
			weatherResult.innerText = data.error + " アルファベット表記で入力してください。";
			weatherResult.classList.add("is-show");
		} else {
			const roundedTemp = data.temperature.toFixed(1);
			const description = weatherDescriptions[data.description] || data.description;

			weatherResult.innerHTML = `
				<h2 class="c-heading-02">${data.city}</h2>
				<div class="p-weather-app__result-item">
					<p class="p-weather-app__result-text">気温：${roundedTemp}℃</p>
					<p class="p-weather-app__result-text">天気：${description}</p>
				</div>
			`;
			weatherResult.classList.add("is-show");
		}
	})
	.catch(error => {
		console.error("エラーが発生しました：", error);
		weatherResult.innerText = error.message;
		weatherResult.classList.add("is-show");
	});
});

// クリアボタンの処理
document.getElementById("js-clear-btn").addEventListener("click", () => {
	const cityInput = document.getElementById("js-city-input");

	// 条件1: inputにテキストが入っていない場合は何もしない
	if (!cityInput.value.trim()) return;

	// 条件2: inputにテキストが入っていて、検索ボタンが押されていない場合も何もしない
	if (cityInput.value.trim() && weatherResult.style.display === "none") return;

	// 条件3: 検索が行われている場合（結果が表示されている場合）
	cityInput.value = "";
	weatherResult.innerHTML = "";
	weatherResult.classList.remove("is-show");
});

const weatherDescriptions = {
	"clear sky": "快晴",
    "few clouds": "晴れ時々曇り",
    "scattered clouds": "曇りがち",
    "broken clouds": "曇り",
    "shower rain": "にわか雨",
    "rain": "雨",
    "thunderstorm": "雷雨",
    "snow": "雪",
    "mist": "霧",
    "厚い雲": "曇り",
    "薄い雲": "晴れ時々曇り",
    "曇りがち": "曇り",
    "小雨": "雨",
    "強い雨": "強雨",
};