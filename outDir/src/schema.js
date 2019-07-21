"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/backSystem', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', function () {
    console.log('database connect error');
});
db.once('open', function () {
    console.log('database connect success');
});
var userSchema = new mongoose.Schema({
    name: String,
    password: String,
    avatar: String
});
var articleSchema = new mongoose.Schema({
    id: String,
    user_name: String,
    face_img: String,
    create_time: Number,
    classify: String,
    update_time: Number,
    title: String,
    content: String
});
var newsSchema = new mongoose.Schema({
    title: String,
    date: String,
    content: String,
    spider_time: String
});
var models = {
    user: mongoose.model('user', userSchema),
    article: mongoose.model('article', articleSchema),
    news: mongoose.model('news', newsSchema)
};
exports["default"] = models;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFxQztBQUNyQyxRQUFRLENBQUMsT0FBTyxDQUFDLGdDQUFnQyxFQUFDLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7QUFDNUUsSUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQTtBQUM5QixFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRTtJQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtBQUN2QyxDQUFDLENBQUMsQ0FBQTtBQUNGLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0lBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0FBQ3pDLENBQUMsQ0FBQyxDQUFBO0FBQ0YsSUFBTSxVQUFVLEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDO0lBQ3JDLElBQUksRUFBRSxNQUFNO0lBQ1osUUFBUSxFQUFFLE1BQU07SUFDaEIsTUFBTSxFQUFFLE1BQU07Q0FDZixDQUFDLENBQUE7QUFDRixJQUFNLGFBQWEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUM7SUFDeEMsRUFBRSxFQUFFLE1BQU07SUFDVixTQUFTLEVBQUUsTUFBTTtJQUNqQixRQUFRLEVBQUUsTUFBTTtJQUNoQixXQUFXLEVBQUUsTUFBTTtJQUNuQixRQUFRLEVBQUUsTUFBTTtJQUNoQixXQUFXLEVBQUUsTUFBTTtJQUNuQixLQUFLLEVBQUUsTUFBTTtJQUNiLE9BQU8sRUFBRSxNQUFNO0NBQ2hCLENBQUMsQ0FBQTtBQUNGLElBQU0sVUFBVSxHQUFHLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQztJQUNyQyxLQUFLLEVBQUUsTUFBTTtJQUNiLElBQUksRUFBRSxNQUFNO0lBQ1osT0FBTyxFQUFFLE1BQU07SUFDZixXQUFXLEVBQUUsTUFBTTtDQUNwQixDQUFDLENBQUE7QUFDRixJQUFNLE1BQU0sR0FBRztJQUNiLElBQUksRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUM7SUFDeEMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQztJQUNqRCxJQUFJLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDO0NBQ3pDLENBQUE7QUFDRCxxQkFBZSxNQUFNLENBQUMifQ==