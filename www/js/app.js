var appKey    = "91fa4e1cd82bd235f3c67da4a6833f92a8475fb6f682071621df6a10718efe76";
var clientKey = "c5a631c7f81e9411911880a744e989d2e548762825da8e5f9f5184e2811a6555";

var ncmb = new NCMB(appKey, clientKey);

//ニフクラmbから取得したデータを入れる予定の変数
var getObjText;
var getObjScore = new Array(5);

//ニフクラmbから取得した体重を格納＆Chart.jsのdatasetsのdataに使うリスト
var weightData = new Array(5); 

///// Called when app launch
$(function() {
    $.mobile.defaultPageTransition = 'none';
    $("#LoginBtn").click(onLoginBtn);
    $("#RegisterBtn").click(onRegisterBtn);
    $("#YesBtn_logout").click(onLogoutBtn);
    //グラフ表示//
    $("#drawMyChart").click(drawChart);
});

//----------------------------------USER MANAGEMENT-------------------------------------//
var currentLoginUser; //現在ログイン中ユーザー

function onRegisterBtn()
{
    //入力フォームからusername, password変数にセット
    var username = $("#reg_username").val();
    var password = $("#reg_password").val();
    
    var user = new ncmb.User();
    user.set("userName", username)
        .set("password", password);
    
    // ユーザー名とパスワードで新規登録
    user.signUpByAccount()
        .then(function(reg_user) {
            // 新規登録したユーザーでログイン
            ncmb.User.login(reg_user)
                     .then(function(login_user) {
                         alert("新規登録とログイン成功");
                         currentLoginUser = ncmb.User.getCurrentUser();
                     　  $.mobile.changePage('#DetailPage');
                     })
                     .catch(function(error) {
                         alert("ログイン失敗！次のエラー発生: " + error);
                     });
        })
        .catch(function(error) {
            alert("新規登録に失敗！次のエラー発生：" + error);
        });
}

function onLoginBtn()
{
    var username = $("#login_username").val();
    var password = $("#login_password").val();
    // ユーザー名とパスワードでログイン
    ncmb.User.login(username, password)
        .then(function(user) {
            alert("ログイン成功");
            currentLoginUser = ncmb.User.getCurrentUser();
            $.mobile.changePage('#DetailPage');
        })
        .catch(function(error) {
            alert("ログイン失敗！次のエラー発生: " + error);
        });
}

function onLogoutBtn()
{
    ncmb.User.logout();
    alert('ログアウト成功');
    currentLoginUser = null;
    $.mobile.changePage('#LoginPage');
}

function drawChart()
{
  //ニフクラmbからデータ取得後に操作するHTML要素を格納
  var importNcmbData = document.getElementById("hereWrite");
  var importNcmbDataArray = document.getElementById("hereShow");
  //ニフクラmbからデータ取得
  var getObj = ncmb.DataStore("TestClass");
  getObj.equalTo("newfield", "体重記録あり")
          .order("createDate", true) //並び替え指定
          .limit(6) //取ってくる値の数
          .fetchAll()
          //function(results)はJavaScriptの即時関数なのでequalToからcatchの;まで１つの動作
          .then(function(results){
              getObjText = results.length + "件取得しました。";

              importNcmbData.innerHTML = getObjText;

              //取ってきた値をlength分回して代入
              for (var i = 0; i < results.length; i++) {
                var object = results[i];
                //代入確認用getObjScore.push(object.message);
                getObjScore[i] = object.petWeight; //+ " - " + object.get("newfield");
                //petWeightの値を格納
                //weightData[i] = getObjScore[i];
              }

              importNcmbDataArray.innerHTML = getObjScore;

            })
          .catch(function(err){
              getObjText = "データ取得できませんでしたもしくは該当なし";

              importNcmbData.innerHTML = getObjText;
              importNcmbDataArray.innerHTML ="うまく表示できませんでしたもしくは該当なし";

            });



  //Chart.jsで折れ線グラフを描画
  const ctx = document.getElementById('myChart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['６', '５', '４', '前々回', '前回', '最新'],
        datasets: [{
            label: '茶トラ',
            pointHitRadius: 30,
            pointBackgroundColor: '#FFFFFF',
            //なぜか一発で出てこない（equalTo内then(function(results))にグラフの描画書く必要ある？？）
            data: getObjScore,//weightData,//[6.31, 6.21, 6.38, 6.66, 6.41, 6.59],
            backgroundColor: [
                'rgba(255, 99, 132, 0.1)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 2
        },
        {
            label: '黒白',
            pointHitRadius: 30,
            pointBackgroundColor: '#FFFFFF',
            data: [3.25, 3.31, 3.28, 3.40, 3.35, 3.59],
            backgroundColor: [
                'rgba(75, 192, 192, 0.1)',
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 2
        }]
    },
    options: {
      layout: {
            padding: 10
        },
      scales: {
        yAxes:[ 
          {
            ticks:{
              beginAtZero: true,
              //stepSize: 0.5,
              callback: function(value, index, values) {
                    return '$' + value;
              }
            }
          }
        ],
        xAxes:[
          {
          }
        ]
    }
      },
      plugins: {
        legend: {
          labels: {
              // This more specific font property overrides the global property
              font: {
                  size: 16
              }
          }
        },
        tooltips: {
        }
      } 
    });
        $.mobile.changePage('#DetailPage');

        
}

