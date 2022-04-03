var appKey    = "appKey";
var clientKey = "clientKey";

var ncmb = new NCMB(appKey, clientKey);

//取得するデータの数と入れる箱の数
const limitAndBox = 10;

//実際に用意する箱の数
const boxNumber = limitAndBox -1;

//ニフクラmbから取得したデータを入れる予定の変数
var getObjText;
var getObjScore = new Array(boxNumber);
var getObjScoreKuroSiro = new Array(boxNumber);

//ニフクラmbから取得した体重を格納＆Chart.jsのdatasetsのdataに使うリスト
//今は使ってないのでコメントアウト
//var weightData = new Array(5); 

var labelsdates = new Array(boxNumber);

//デバック確認用
//for(i = 0; i < 30; i++) {
//  labelsdates[i] = i+1 ;
//}

var formerDate = new Array(limitAndBox);

var petsMemo = new Array(limitAndBox);

///// Called when app launch
$(function() {
    $.mobile.defaultPageTransition = 'none';
    $("#LoginBtn").click(onLoginBtn);
    $("#RegisterBtn").click(onRegisterBtn);
    $("#YesBtn_logout").click(onLogoutBtn);
    //グラフ表示//
    $("#graphReloadBtn").click(getChartData);
    $(".iniMemoZone").click(getChartData);
    $("#profileReloadBtn").click(updateAppDisplay);

    //タップゾーン非表示にしたのでOFF
    //$("#tapDisplayGraph").click(getChartData);

});

function CheckPassword() {
		// 入力値取得
		var input1 = $("#reg_password").val();
		var input2 = $("#reg_confirmpassword").val();

        var checkResults = document.getElementById("constCheckPass");

		// パスワード比較
		if(input1 != input2){
			//confirm.setCustomValidity("入力値が一致しません。");
            checkResults.innerText = "入力値が一致しません。";

		}else{
			//confirm.setCustomValidity('');
            checkResults.innerText = "";
		}
}


//----------------------------------USER MANAGEMENT-------------------------------------//
var currentLoginUser; //現在ログイン中ユーザー

function onRegisterBtn()
{
    //入力フォームからusername, password変数にセット
    var username = $("#reg_username").val();
    var password = $("#reg_password").val();
    //var pettagid_1 = $("#reg_pettagid_1").val();
    //var pettagid_2 = $("#reg_pettagid_2").val();
    var comfirmPassword = $("#reg_confirmpassword").val();

    // パスワード比較。一致しないまま新規登録ボタン押下した場合に以降の処理させずにreturn
    if(password != comfirmPassword){
        var checkResultsWord = document.getElementById("constCheckPass");
        return checkResultsWord.innerText = "入力値が一致していません。";
    }else{

    var user = new ncmb.User();
    user.set("userName", username)
        .set("password", password);
        //.save();
        //.set("petTagId_1", pettagid_1)
        //.set("petTagId_2", pettagid_2)

    
    // ユーザー名とパスワードで新規登録
    user.signUpByAccount()
        .then(function(reg_user) {
            // 新規登録したユーザーでログイン
            ncmb.User.login(reg_user)
                     .then(function(login_user) {
                         alert("新規登録とログイン成功");
                         currentLoginUser = ncmb.User.getCurrentUser();
                         $.mobile.changePage('#DetailPage');
                        //現在ログインしているユーザーのオブジェクトIDを取得
                        //var currentNewLoginUser = ncmb.User.getCurrentUser();
                        var currentNewUserId = currentLoginUser.get("objectId");
                        //ペットデータクラスにデータ2つ作成する動作をここに作成する
                        //オブジェクトIDからペットデータクラスに箱を用意（2回回す）
                        for (var whileCount = 0; whileCount < 2; whileCount++) { 
                            var makePetsData = ncmb.DataStore("PetProfileClass");
                            var petsDataBox = new makePetsData();
                            //var iniInfo_1 = "名前未設定";
                            //var iniInfo_2 = "未設定";
                            //var iniInfo_3 = "2006年4月11日";
                                petsDataBox.set("userObjectId", currentNewUserId);
                                           //.set("petName", iniInfo_1)
                                           //.set("petTagId", iniInfo_2)
                                           //.set("petBirth", iniInfo_3)
                                           //.set("petSex", iniInfo_2)
                                           //.set("petFavorite", iniInfo_2)
                                           //.set("petWeak", iniInfo_2);

                                petsDataBox.save();
                                           //.then(function(petsDataBox) {
                                           //        // Save success.
                                           //    })
                                           //.catch(function(error) {
                                           //        // Save failed.
                                           //    });
                        }
                     })
                     .catch(function(error) {
                         alert("ログイン失敗！次のエラー発生: " + error);
                     });
        })
        .catch(function(error) {
            alert("新規登録に失敗！次のエラー発生：" + error);
        });
    }
    
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
            //現在ログインしているユーザーのオブジェクトIDを取得
            var currentUserId = currentLoginUser.get("objectId");
            //var begugTest = document.getElementById("debugObjId");
            //begugTest.innerText = currentUserId;

            //オブジェクトIDからペット情報を取得，情報を入力
            var getObj = ncmb.DataStore("PetProfileClass");
                getObj.equalTo("userObjectId", currentUserId)
                      .order("createDate")
                      .limit(2)
                      .fetchAll()
                      .then(function(results){
                          //取ってきた値をlength分回して代入
                            for (var i = 0; i < results.length; i++) {
                                var object = results[i];

                                    var petName = document.getElementById("petName_" + i);
                                    var profileObjId = document.getElementById("profileObjId_" + i);
                                    var tagId = document.getElementById("tagId_" + i);
                                    var birth = document.getElementById("birth_" + i);
                                    var sex = document.getElementById("sex_" + i);
                                    var favorite = document.getElementById("favorite_" + i);
                                    var weak = document.getElementById("weak_" + i);

                                    var memopetName = document.getElementById("memoPetName_" + i);

                                    //if文で値がundifinedの場合は「未設定」と代入する
                                    if (object.petName === undefined) {
                                        petName.innerText = "名前未設定";
                                        memopetName.innerText= "名前未設定";
                                    } else {
                                    //PetProfileClassのpetNameの値を代入
                                    petName.innerText = object.petName;
                                    memopetName.innerText = object.petName;
                                    }

                                    if (object.objectId === undefined) {
                                        profileObjId.innerText = "未設定";
                                    } else {
                                    //PetProfileClassのobjectIdの値を代入
                                    profileObjId.innerText = object.objectId;
                                    }

                                    if (object.petTagId === undefined) {
                                        tagId.innerText = "未設定";
                                    } else {
                                    //PetProfileClassのpetTagIdの値を代入
                                    tagId.innerText = object.petTagId;
                                    }
                                    
                                    if(object.petBirth === undefined) {
                                        birth.innerText = "未設定";
                                    } else {
                                    //PetProfileClassのpetBirthの値を代入
                                    birth.innerText = object.petBirth;
                                    }

                                    if(object.petSex === undefined) {
                                        sex.innerText = "未設定";
                                    } else {
                                    //PetProfileClassのpetSexの値を代入
                                    sex.innerText = object.petSex;
                                    }

                                    if(object.petFavorite === undefined) {
                                        favorite.innerText = "未設定";
                                    } else {
                                    //PetProfileClassのpetFavoriteの値を代入
                                    favorite.innerText = object.petFavorite;
                                    }

                                    if(object.petWeak === undefined) {
                                        weak.innerText = "未設定";
                                    } else {
                                    //PetProfileClassのpetWeakの値を代入
                                    weak.innerText = object.petWeak;
                                    }

                            }
                          })
                        .catch(function(err){
                            var begugTest = document.getElementById("debugObjId");
                            begugTest.innerText ="うまく表示できませんでしたもしくは該当なし";
                        });

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

function getChartData()
{
  $(".hide--display #myChart").removeClass("hide--display");
  $("#myChart").addClass("display--chart");
  $(".tapGraphZorn #tapDisplayGraph").removeClass("tapGraphZorn");
  $("#tapDisplayGraph").addClass("hide--display");

  $(".contents").css({'background-image':'none'});
  $(".memoBlocks").css({'display':'contents'});
  $(".iniMemoZone").css({'display':'none'});


  //canvasの親要素のdivに高さを設定すると、canvasはその中で表示される、グラフの高さを指定できる
  //こっちで指定されてるっぽい
  var specifyHeight = '43vh';
  $(".canvasDrawZone").css({'height':specifyHeight});

  //var canvasParentDiv = document.getElementsByClassName(".display--chart");
  //var canvasChild = document.getElementById("myChart");
  //canvasChild.setAttribute("width", canvasParentDiv.getAttribute("width"));
  //canvasChild.setAttribute("height", "300");

  //ニフクラmbからデータ取得後に操作するHTML要素を格納
  var importNcmbData = document.getElementById("hereWrite");
  var importNcmbDataArray = document.getElementById("hereShow");
  //プロフィール欄のタグIDから値を取得
  var profileTagId1 = document.getElementById("tagId_0").innerText;
  var profileTagId2 = document.getElementById("tagId_1").innerText;
  //ニフクラmbからデータ取得
  var getObj = ncmb.DataStore("PetRecordClass");
  getObj.equalTo("petTagId", profileTagId1)
          .order("createDate") //並び替え降順指定
          .limit(limitAndBox) //取ってくる値の数
          .fetchAll()
          //function(results)はJavaScriptの即時関数なのでequalToからcatchの;まで１つの動作
          .then(function(results){
              getObjText = results.length + "件取得しました。";

              importNcmbData.innerHTML = getObjText;

              //取ってきた値をlength分回して代入
              for (var i = 0; i < results.length; i++) {
                var object = results[i];
                //代入確認用getObjScore.push(object.message);
                getObjScore[i] = object.petWeigth; //+ " - " + object.get("newfield");
                //petWeightの値を格納
                //weightData[i] = getObjScore[i];
                //labelsdatesに日時を入れるけど多分formerDateを経由しなくてもよさそう
                formerDate[i] = object.createDate.split("T", 1);
                
                labelsdates[i] = formerDate[i];
                
                petsMemo[i] = object.dailyMemo;

                //メモ欄に値を入れる
                var importMemoDates = document.getElementById("memodate_0_" + i);
                var importMemoFields = document.getElementById("memofield_0_" + i);
                //オブジェクトIDを入れる
                var importObjectId = document.getElementById("objId_0_" + i);
                //実際にテキストを入れる
                importMemoDates.innerText = formerDate[i];
                
                importObjectId.innerText = object.objectId;

                if(petsMemo[i] === undefined) {
                    importMemoFields.innerText = "メモの内容が入ります。";
                } else {
                //PetProfileClassのpetSexの値を代入
                importMemoFields.innerText = petsMemo[i];
                }

              }

              importNcmbDataArray.innerHTML = labelsdates;
              
              //chart入れてみるとグラフ一発で表示される
              drawChart();

            })
          .catch(function(err){
              getObjText = "データ取得できませんでしたもしくは該当なし";

              importNcmbData.innerHTML = getObjText;
              importNcmbDataArray.innerHTML ="うまく表示できませんでしたもしくは該当なし";

              //取得できなかった表示をする
              var errMsgDisplay = document.getElementById("canvasDrawZone");
              errMsgDisplay.innerHTML = "データ取得できませんでした。もしくは該当しませんでした。";

            });



  //ニフクラmbからデータ取得
  var getObjKuroSiro = ncmb.DataStore("PetRecordClass");
  getObjKuroSiro.equalTo("petTagId", profileTagId2)
          .order("createDate") //並び替え降順指定
          .limit(limitAndBox) //取ってくる値の数
          .fetchAll()
          //function(results)はJavaScriptの即時関数なのでequalToからcatchの;まで１つの動作
          .then(function(results){
              //取ってきた値をlength分回して代入
              for (var i = 0; i < results.length; i++) {
                var object = results[i];
                //代入確認用getObjScore.push(object.message);
                getObjScoreKuroSiro[i] = object.petWeigth; //+ " - " + object.get("newfield");
                //petWeightの値を格納
                //weightData[i] = getObjScore[i];
                //labelsdatesに日時を入れる

                formerDate[i] = object.createDate.split("T", 1);
                petsMemo[i] = object.dailyMemo;


                //メモ欄に値を入れる
                var importMemoDates = document.getElementById("memodate_1_" + i);
                var importMemoFields = document.getElementById("memofield_1_" + i);
                //オブジェクトIDを入れる
                var importObjectId = document.getElementById("objId_1_" + i);
                //実際にテキストを入れる
                importMemoDates.innerText = formerDate[i];
                
                importObjectId.innerText = object.objectId;

                if(petsMemo[i] === undefined) {
                    importMemoFields.innerText = "メモの内容が入ります。";
                } else {
                //PetProfileClassのpetSexの値を代入
                importMemoFields.innerText = petsMemo[i];
                }


              }

              //chart入れてみるとグラフ一発で表示される
              drawChart();
            })
          .catch(function(err){
            //取得できなかった表示をする
            var errMsgDisplay = document.getElementById("canvasDrawZone");
            errMsgDisplay.innerHTML = "データ取得できませんでした。もしくは該当しませんでした。";
            });
}




//グラフ描画を呼び出す関数
function drawChart()
{
  var specifyHeight = '40vh'; 
  var ctxHeight = document.getElementById('myChart');
  ctxHeight.height = specifyHeight;
  //$("#myChart").css({'height':specifyHeight});

  //プロフィールからペットの名前を取得
  var petNameLable_0 = document.getElementById("petName_0").innerText;
  var petNameLable_1 = document.getElementById("petName_1").innerText;
  //Chart.jsで折れ線グラフを描画
  const ctx = document.getElementById('myChart').getContext('2d');
  //var ctxHeight = document.getElementById('myChart');
  //ctxHeight.height = window.innerHeight/2.5;
  

  Chart.defaults.global.defaultFontColor = '#210D0D';
  Chart.defaults.global.defaultFontFamily = "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
  Chart.defaults.global.defaultFontSize = 12;

  //グラフの色とメモ管理のペット名カラーを一致させる
  const colorLabel_0 = '#FB5860';
  const colorLabel_1 = '#0AD8D5';

  $("#memoPetName_0").css({'border-left':'8px solid' + colorLabel_0});
  $("#memoPetName_1").css({'border-left':'8px solid' + colorLabel_1});
  $(".titleMemoDateBlocks_0").css({'background':'linear-gradient(transparent 80%, ' + colorLabel_0 + ' 70%)'});
  $(".titleMemoDateBlocks_1").css({'background':'linear-gradient(transparent 80%, ' + colorLabel_1 + ' 70%)'});



  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labelsdates,//['６', '５', '４', '前々回', '前回', '最新'],
        datasets: [{
            label: petNameLable_0,
            //pointHitRadius: 1,
            pointBackgroundColor: '#FFFFFF',
            //なぜか一発で出てこない（equalTo内then(function(results))にグラフの描画書く必要ある？？）
            data: getObjScore,//weightData,//[6.31, 6.21, 6.38, 6.66, 6.41, 6.59],
            backgroundColor: [
                'rgba(255, 255, 255, 0.1)',
            ],
            borderColor: [
                colorLabel_0,
            ],
            borderWidth: 2,
            lineTension: 0,
            spanGaps: true,
        },
        {
            label: petNameLable_1,
            //pointHitRadius: 1,
            pointBackgroundColor: '#FFFFFF',
            data: getObjScoreKuroSiro,//[3.25, 3.31, 3.28, 3.40, 3.35, 3.59],
            backgroundColor: [
                'rgba(255, 255, 255, 0.1)',
            ],
            borderColor: [
                colorLabel_1,
            ],
            borderWidth: 2,
            lineTension: 0,
            spanGaps: true,
        }]
    },
    options: {
      responsive: true,
      //widthとheightサイズ変更が発生した時に元のキャンバスのアスペクト比を維持しない
      //maintainAspectRatio: false,
      layout: {
            padding: 5
        },
      scales: {
        yAxes:[ 
          {
            ticks:{
                beginAtZero: true,
                stepSize: 1.0,
                callback: function(value, index, values) {
                        return value + "Kg";
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
                  //size: 14
              }
          }
        },
        tooltips: {
        }
      } 
    });
        //$.mobile.changePage('#DetailPage');
}


    //使い方ガイドのバー機能
    var  upSpeed= 20;  //メッセージのスライド速度
    var  delay = 4800; // 次のメッセージに切り替わるまでの静止時間
    var  tickerH= 32;  // 表示ボックスの高さ
    window.onload =function divScroller(){
        scroller = document.getElementById("ticKerUseTip"); // div 表示ボックス
        scroller.style.height= tickerH+"px"; // 表示ボックスの高さ
        scroller.style.lineHeight= tickerH+"px"; // 行の高さ  
        slide = document.getElementById("ulArea"); // スライドさせる ul要素
        slide.style.position = "absolute"; // 絶対配置
        slide.style.top = tickerH+"px" ;  // slide のtop(上辺)の位置
        innScroll(tickerH, upSpeed, delay)
    }
    function innScroll(tickerH, upSpeed, delay){
    msec = upSpeed; // スクロール時間
    numTop = parseInt(slide.style.top) // 数値文字列を整数に変換
        if (numTop > -tickerH){ // top位置が -30にならない間は
            slide.style.top = (numTop-1)+"px"; // top位置を -1px 上へ
        } else { slide.style.top = 0+"px"; 
                cngLi(); // 次のメッセージと交代
                }
    if(numTop==0){msec = delay;// 静止時間 現在のメッセージを待機
    }
        setTimeout("innScroll("+ tickerH +","+ upSpeed +"," + delay +")", msec);
    }
    function cngLi(){ // メッセージの移動
    base= document.getElementById("ulArea");
        liList = base.getElementsByTagName("li");// 与えられたタグ名を持つ要素のリスト
        elm = liList[0];// 最上部の "li"要素
        base.appendChild(elm); // elm を子ノードとして末尾に移動する。
    }





//メモ欄をペット別に表示ON/OFFの動作部分。
function checkEdit() {
  const memoField = document.getElementById("memofield_0_0");
  const button = document.getElementById("button");
  if(memoField.value && memoField.value.length) {
    // 入力欄が空ならdisabled解除
    button.disabled = false;
  } else {
    // 入力されているならdisabledを付与
    button.disabled = true;
  }
}
//元はul配下のliで動作する例を参照。今回はクラスとidで指定している。
// navの小要素であるliをクリックして、contents内の小要素であるli要素を表示させる。
// .index() 要素のindexを取得。
// .eq() 引数に応じたindexの要素を指定。
// .addClass() クラスを追加。
// .removeClass() クラスを削除。
$(function(){
  $(".nav .navDiv").click(function(){//navクラスのliをクリックしたらイベントスタート
    var num = $(this).index();//navクラスのliのインデックス番号を取得
    $(".contents #memoF").addClass("is-hidden");//一旦contentsクラスのliにis-hiddenクラスを追加し、全て非表示にする
    $(".contents #memoF").eq(num).removeClass("is-hidden");//eq()でnavクラスのliのインデックス番号を引数に指定し、
//contentsクラスの同じインデックス番号のliのis-hiddenクラスを削除。これで選択したタブと紐ずく内容だけを表示できる
  })
});

//メモ更新機能に必要な動作。
function startEditBtnJs(idNum_1, idNum_2) {
  var memoObjIdChecker = document.getElementById("objId_"+ idNum_1 + "_" + idNum_2);
  if (memoObjIdChecker.innerText == "DBのobjId") {

  } else {
    //スムーススクロール（画面のトップに移動）
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    //var idDegug = document.getElementById("detailArea");
    var memoId = document.getElementById("memodate_" + idNum_1 + "_" + idNum_2);
    var memoFieldId = document.getElementById("memofield_" + idNum_1 + "_" + idNum_2);
    var memoObjId = document.getElementById("objId_"+ idNum_1 + "_" + idNum_2);
    //日にち取れているかDebug
    //idDegug.innerText = memoId.innerText;
    //モーダルウィンドウの要素に日にち，メモの内容を入れる
    var modalDate = document.getElementById("modalMotal_p_01");
    modalDate.innerText = memoId.innerText;
    var modalMemo = document.getElementById("modalMotal_p_02");
    modalMemo.innerText = memoFieldId.innerText;
    var modalObjId = document.getElementById("chooseObjId");
    modalObjId.innerText = memoObjId.innerText;

    //メモ編集画面ポップアップの動作
    $("#modalMotal").removeClass("hidden");
    $("#maskMotal").removeClass("hidden");
    $("#sendMotal").removeClass("hidden");
  }

}


//メモ編集画面ポップアップの動作debug
$(function(){
  $("#closeMotal").click(function(){//クリックしたらイベントスタート
    $("#modalMotal").addClass("hidden");
    $("#maskMotal").addClass("hidden");
    $("#sendMotal").addClass("hidden");
    //textareaの中身をリセット
    var modalMemoEdit = document.getElementById("modalMotal_p_03");
    modalMemoEdit.value = "";

  })
  $("#maskMotal").click(function(){//クリックしたらイベントスタート
    $("#closeMotal").click();
    //textareaの中身をリセット
    var modalMemoEdit = document.getElementById("modalMotal_p_03");
    modalMemoEdit.value = "";
  })
  $("#sendMotal").click(function(){//クリックしたらメモ編集のtextarea内容をDBに送信
    //DBで検索するobjectIdを変数に格納する
    const searchObjId = document.getElementById("chooseObjId");
    //textareaの内容を変数に格納する
    const sendMemoText = document.getElementById("modalMotal_p_03").value;
    //DBへ送信する
    var sendMemo = ncmb.DataStore("PetRecordClass");
    sendMemo.equalTo("objectId", searchObjId.innerText)//objectIdで一発検索する
          .limit(1) //取ってくる値の数
          .fetchAll()
          //function(results)はJavaScriptの即時関数なのでequalToからcatchの;まで１つの動作
          .then(function(results){
              var object = results[0];
              object.set("dailyMemo", sendMemoText)
                    .update()
                    //.save()
                    .then(function(result){
                            //保存後の動作
                            $(function(){
                                $(".afterMotal").removeClass("hide--afterSendMotal");//表示できる
                                document.getElementById("afSendMsg_p1").innerText = "保存完了";
                                document.getElementById("afSendMsg_p2").innerText = "タップして閉じる";
                            });
                        })
                        .catch(function(error){
                            //エラー処理
                            $(function(){
                                $(".afterMotal").removeClass("hide--afterSendMotal");//表示できる
                                document.getElementById("afSendMsg_p1").innerText = "保存エラー";
                                document.getElementById("afSendMsg_p2").innerText = "もう一度お試しください";
                            });
                        });
          })

    $("#closeMotal").click();
    //textareaの中身をリセット
    var modalMemoEdit = document.getElementById("modalMotal_p_03");
    modalMemoEdit.value = "";
  })
});

//プロフィール編集画面
function profileEdit(profileNum) {
    var petName = document.getElementById("petName_" + profileNum);
    var profileObjId = document.getElementById("profileObjId_" + profileNum);
    var tagId = document.getElementById("tagId_" + profileNum);
    var birth = document.getElementById("birth_" + profileNum);
    var sex = document.getElementById("sex_" + profileNum);
    var favorite = document.getElementById("favorite_" + profileNum);
    var weak = document.getElementById("weak_" + profileNum);

    var  petNameItem= document.getElementById("petNameItem");
    petNameItem.innerText = petName.innerText;
    var  petProfileObjId = document.getElementById("profileObjId");
    petProfileObjId.innerText = profileObjId.innerText;
    var  tagIdItem= document.getElementById("tagIdItem");
    tagIdItem.innerText = tagId.innerText;
    var  birthItem= document.getElementById("birthItem");
    birthItem.innerText = birth.innerText;
    var  sexItem= document.getElementById("sexItem");
    sexItem.innerText = sex.innerText;
    var  favoriteItem= document.getElementById("favoriteItem");
    favoriteItem.innerText = favorite.innerText;
    var  weakItem= document.getElementById("weakItem");
    weakItem.innerText = weak.innerText;

  //プロフィール編集画面ポップアップの動作
  $("#profileModal").removeClass("hidden--profile");
  $("#profileEditModal").removeClass("hidden--profile");

  //スムーススクロール（画面のトップに移動）
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

//プロフィール編集画面ポップアップの動作debug
$(function(){
  $("#closeProfile").click(function(){//クリックしたらイベントスタート
    $("#profileModal").addClass("hidden--profile");
    $("#profileEditModal").addClass("hidden--profile");
    //中身をリセット
    //var modalMemoEdit = document.getElementById("modalMotal_p_03");
    //modalMemoEdit.value = "140文字以内で入力してください";

  })
  $("#profileModal").click(function(){//クリックしたらイベントスタート
    $("#closeProfile").click();
    //textareaの中身をリセット
    //var modalMemoEdit = document.getElementById("modalMotal_p_03");
    //modalMemoEdit.value = "140文字以内で入力してください";
  })
  $("#sendProfile").click(function(){//クリックしたらプロフィール編集のinputに値が入っている項目を確認，値を別の関数（最終確認のポップアップと実際の送信動作をする）に入れる
    //DBで検索するobjectIdを変数に格納する
    var searchObjId = document.getElementById("profileObjId").innerText;
    //inputのタグ名を配列に入れておく
    var inputItemsArray = ["petNameInfo", "tagIdInfo", "birthInfo", "sexInfo", "favoriteInfo", "weakInfo"];
    //フラグを格納する配列
    var infoLengthArray = new Array(5);
    //文字列を格納する配列
    var updateProData = new Array(5);
    // inputItemsArray配列の長さ分for文回す
    for (var i = 0; i < inputItemsArray.length; i++) {
        if (document.getElementById(inputItemsArray[i]).value.length === 0) {
            //文字列の長さが０，値が入っていない場合はフラグを０とする
            infoLengthArray[i] = 0;
        } else {
            //文字列の長さが０でない，値が入っている場合はフラグを１とする
            infoLengthArray[i] = 1;
        }
        //文字列を配列に格納
        updateProData[i] = document.getElementById(inputItemsArray[i]).value;
        $("#" + inputItemsArray[i]).val("");
    }
    //実際の送信動作をする関数に，オブジェクトIDと２つの配列を引数として渡す
    finalCheckSend(searchObjId, infoLengthArray, updateProData);

    //デバッグ確認用
    //var debugCheck = document.getElementById("debugjsinside");
    //debugCheck.innerText = updateProData.length;

    $("#closeProfile").click();
  })
  //ん？$("#profileReloadBtn").click(updateAppDisplay);//「プロフィール」クリックしたらペット情報再取得と表示更新
});

//実際の送信動作をする関数
function finalCheckSend(sendObjId, infoFlags, sendProDatas) {
    //DBへ更新する情報を送信する
    var sendUpdateData = ncmb.DataStore("PetProfileClass");
    sendUpdateData.equalTo("objectId", sendObjId)//objectIdで一発検索する
                  .limit(1) //取ってくる値の数
                  .fetchAll()
                  //function(results)はJavaScriptの即時関数なのでequalToからcatchの;まで１つの動作
                  .then(function(results){
                      //フィールドの名前配列
                      const fieldNames = ['petName', 'petTagId', 'petBirth', 'petSex', 'petFavorite', 'petWeak'];
                      var object = results[0];
                      for (var i = 0; i < infoFlags.length; i++) {
                          if (infoFlags[i] === 0) {
                              //フラグ０の場合は何もしない
                          } else {
                              //フラグ１の場合はobjectにセットする
                              object.set(fieldNames[i], sendProDatas[i]);
                                    //.save()
                          }
                      }
                      object.save();
                      //保存したobjectオブジェクトを更新
                      object.update();
                  })
                  .then(function(result){
                      //更新後の処理
                      $(function(){
                        $(".afterMotal").removeClass("hide--afterSendMotal");//表示できる
                        document.getElementById("afSendMsg_p1").innerText = "保存完了";
                        document.getElementById("afSendMsg_p2").innerText = "タップして閉じる";
                      });
                  })
                  .catch(function(error){
                      //エラー処理
                      $(function(){
                        $(".afterMotal").removeClass("hide--afterSendMotal");//表示できる
                        document.getElementById("afSendMsg_p1").innerText = "保存エラー";
                        document.getElementById("afSendMsg_p2").innerText = "もう一度お試しください";
                      });
                  });



}

//保存ボタン押下後に表示されるボタン動作
$(function(){
  $(".afterMotal").click(function(){//イベントスタート
            $(".afterMotal").addClass("hide--afterSendMotal");//非表示にする
            var elm_main = document.getElementById("GraphMemoScreen");
            var elm_profile = document.getElementById("myPageScreen");
            if(elm_main.classList.contains("hide--Screen") == false) {
                getChartData();//グラフとメモの更新
            } else {
            }
            
            if(elm_profile.classList.contains("hide--Screen") == false) {
                updateAppDisplay();//プロフィールの更新
            } else {
            }
        })
});

function updateAppDisplay() {
    var currentLoginUser = ncmb.User.getCurrentUser();
    //現在ログインしているユーザーのオブジェクトIDを取得
    var currentUserId = currentLoginUser.get("objectId");
    //var begugTest = document.getElementById("debugObjId");
    //begugTest.innerText = currentUserId;

    //オブジェクトIDからペット情報を取得，情報を入力
    var getObj = ncmb.DataStore("PetProfileClass");
        getObj.equalTo("userObjectId", currentUserId)
                .order("createDate")
                .limit(2)
                .fetchAll()
                .then(function(results){
                    //取ってきた値をlength分回して代入
                    for (var i = 0; i < results.length; i++) {
                        var object = results[i];

                            var petName = document.getElementById("petName_" + i);
                            var profileObjId = document.getElementById("profileObjId_" + i);
                            var tagId = document.getElementById("tagId_" + i);
                            var birth = document.getElementById("birth_" + i);
                            var sex = document.getElementById("sex_" + i);
                            var favorite = document.getElementById("favorite_" + i);
                            var weak = document.getElementById("weak_" + i);

                            var memopetName =document.getElementById("memoPetName_" + i);

                            //if文で値がundifinedの場合は「未設定」と代入する
                            if (object.petName === undefined) {
                                petName.innerText = "名前未設定";
                                memopetName.innerText= "名前未設定";
                            } else {
                            //PetProfileClassのpetNameの値を代入
                            petName.innerText = object.petName;
                            memopetName.innerText = object.petName;
                            }

                            if (object.objectId === undefined) {
                                profileObjId.innerText = "未設定";
                            } else {
                            //PetProfileClassのobjectIdの値を代入
                            profileObjId.innerText = object.objectId;
                            }

                            if (object.petTagId === undefined) {
                                tagId.innerText = "未設定";
                            } else {
                            //PetProfileClassのpetTagIdの値を代入
                            tagId.innerText = object.petTagId;
                            }
                            
                            if(object.petBirth === undefined) {
                                birth.innerText = "未設定";
                            } else {
                            //PetProfileClassのpetBirthの値を代入
                            birth.innerText = object.petBirth;
                            }

                            if(object.petSex === undefined) {
                                sex.innerText = "未設定";
                            } else {
                            //PetProfileClassのpetSexの値を代入
                            sex.innerText = object.petSex;
                            }

                            if(object.petFavorite === undefined) {
                                favorite.innerText = "未設定";
                            } else {
                            //PetProfileClassのpetFavoriteの値を代入
                            favorite.innerText = object.petFavorite;
                            }

                            if(object.petWeak === undefined) {
                                weak.innerText = "未設定";
                            } else {
                            //PetProfileClassのpetWeakの値を代入
                            weak.innerText = object.petWeak;
                            }

                    }
                    })
                .catch(function(err){
                    var begugTest = document.getElementById("debugObjId");
                    begugTest.innerText ="うまく表示できませんでしたもしくは該当なし";
                });
}




//画面下メニューボタン切り替え動作の部分
$(function(){
  $("#ProfileBtn").click(function(){//イベントスタート
    $(".GraphMemo").addClass("hide--Screen");//非表示にする
    $(".ProfileMyPage").removeClass("hide--Screen");//表示できる
  })
  $("#ProfileBtn").click(updateAppDisplay);//初回アクセス向けにプロフィールボタン押したらデータ取得しに行くようにしている
  $("#ManageBtn").click(function(){//イベントスタート
    $(".ProfileMyPage").addClass("hide--Screen");//非表示にする
    $(".GraphMemo").removeClass("hide--Screen");//表示できる
  })
  $("#ManageBtn").click(getChartData);
});


