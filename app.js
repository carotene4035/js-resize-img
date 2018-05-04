/** imageUrlを渡すと, 圧縮してくれ、blobを返す */
/** 使うときはResizer.resize(); */



(function(global) {

  /*
   * publicなオブジェクト
   * (はじめはコンストラクタで書いていたが、そもそもnewする必要が無いので
   * オブジェクトで提供することにした)
   */
  Resizer = {};

  Resizer.resize = function(imageUrl) {
    // Image オブジェクトに src を指定すると、元画像の width と height が取れる
    const img = new Image();

    /** リーダから読み込んだ値をオブジェクト化 */
    img.src = imageUrl;
    var self = this;

    /** img.src読み込み後の処理 */
    img.onload = function() {
      /** 画像をリサイズ */
      const base64 = resizeImage(img);
      return base64
    };
  }

  /*
   * @param img Imageオブジェクト
   */
  var resizeImage =  function(img) {
    /** 画像の読み込み */
    const width = img.width;
    const height = img.height;

    // 縮小後のサイズを計算。ここでは横幅 (width) を指定
    const dstWidth = 1280;
    const scale = dstWidth / width;
    const dstHeight = height * scale;

    // Canvas オブジェクトを使い、縮小後の画像を描画
    const canvas = document.createElement('canvas');
    canvas.width = dstWidth;
    canvas.height = dstHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, dstWidth, dstHeight);

    // Canvas オブジェクトから Data URL を取得
    const resized = canvas.toDataURL('image/jpeg');
    return resized;
  }


  var base64ToBlob = function(base64) {
    const base64Data = base64.split(',')[1]; // Data URLからBase64のデータ部分のみを取得
    const data = window.atob(base64Data); // base64形式の文字列をデコード
    const buff = new ArrayBuffer(data.length);
    const arr = new Uint8Array(buff);

    let blob;
    let i;
    let dataLen;

    // blobの生成
    for (i = 0, dataLen = data.length; i < dataLen; i++) {
      arr[i] = data.charCodeAt(i);
    }

    /** ファイルオブジェクトの生成 */
    blob = new Blob([arr], {
      type: 'image/png'
    });

    return blob;
  }

  global.Resizer = Resizer;

})(this);

/** 使い方 */
/** ここで注意：retにはundefinedが入る。
 * なぜなら、resize処理は非同期で行われるから
 * これを防ぐには、resizeが終わった時のcallbak関数を
 * 持たなくてはならない
 */
const ret = Resizer.resize('./images/test.jpg');
