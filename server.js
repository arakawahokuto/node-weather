const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();
const request = require("request");

const app = express();
const PORT = 3000;

// 静的ファイルのルーティング
app.use(express.static(path.join(__dirname, "public")));

// 天気情報取得のAPIルートを追加
app.get("/weather", (req, res) => {
	const city = req.query.city;
	if (!city) {
		return res.status(400).json({ error: "都市名が指定されていません。"});
	}

	const options = {
		url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ja&appid=${process.env.API_KEY}`,
		method: "GET",
		json: true,
	};

	request(options, (error, response, body) => {
		// APIリクエストエラーをチェック
		if (error) {
			return res.status(500).json({ error: "天気情報の取得に失敗しました。"});
		}

		// 400エラー対応: 無効な都市名のとき
		if (body.cod === "400") {
			return res.status(400).json({ error: "無効な都市名です。有効な都市名をアルファベットで入力してください。"});
		}

		// 404エラー対応: 都市が見つからないとき
		if (body.cod === "404") {
			return res.status(404).json({ error: "指定された都市の天気情報が見つかりませんでした。"});
		}

		// その他のエラーチェック
		if (body.cod !== 200) {
			return res.status(400).json({ error: "有効な都市名をアルファベットで入力してください。"});
		}

		res.json({
			city: body.name,
			temperature: body.main.temp,
			description: body.weather[0].description,
		});
	});
});

// サーバーの起動
app.listen(PORT, () => {
	console.log(`サーバーがポート${PORT}で起動しました。http://localhost:${PORT}`)
})

