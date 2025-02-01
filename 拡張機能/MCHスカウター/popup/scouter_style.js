// スタイル追加
var styleElem = document.createElement("style");
	styleElem.textContent = `
        .appHeader[data-v-7ebbd4a4]{ z-index:3; }
	    .overlay { position: absolute; width: 124px; height: 124px; background-color: rgba(128,128,128,0.0); z-index: 1; padding:0; }
        .circle { display: block; border: 5px dashed white; border-radius: 50%; width: 80px; height: 80px; position: absolute; padding: 0; top: 17px; left: 17px; animation: spin-left 5s linear infinite }
        .circle2 { border: 5px dashed white; border-radius: 50%; width: 40px; height: 40px; position: absolute; top: 37px; left: 37px; animation: spin-right 4s linear infinite; }

        .fedein{
            animation-name: fadein;
            animation-duration: 0.5s;
            animation-iteration-count: 1;
        }
        .spin-left{
            animation: spin-left 5s linear infinite;  
        }


        .right-arrow {
            position: absolute; width: 0; height: 0; margin:0; padding:0; top: 30px; left: -17px;
            border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-left: 10px solid white;
        }
        .right-arrow2 {
            position: absolute; width: 0; height: 0; left: -13px; top:14px;
            border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-left: 6px solid white;
        }

        .left-arrow {
            position: absolute; width: 0; height: 0; right:-17px; top:30px;
            border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-right: 10px solid white;
        }
        .left-arrow2 {
            position: absolute; width: 0; height: 0; right:-13px; top: 14px;
            border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-right: 6px solid white;
        }

        @-webkit-keyframes spin-left {
            100% {
                -webkit-transform: rotate(-360deg);
                -moz-transform: rotate(-360deg);
                -ms-transform: rotate(-360deg);
                -o-transform: rotate(-360deg);
                transform: rotate(-360deg);
            }
        }
        @-webkit-keyframes spin-right {
            100% {
                -webkit-transform: rotate(360deg);
                -moz-transform: rotate(360deg);
                -ms-transform: rotate(360deg);
                -o-transform: rotate(360deg);
                transform: rotate(360deg);
            }
        }

        @keyframes fadein {
            0% {
                transform: scale(0.5);
                opacity: 0;
            }
            50% {
                transform: scale(1.5);
                opacity: 0.8;
            }
            80% {
                transform: scale(0.8);
                opacity: 0.9;
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }

        .line1{
            position:absolute;
            top:50%;
            left:50%;
            border:1px solid white;
            height:0;
            width: 0;
            transform: rotate(-45deg);
            transform-origin: 0% 0%;
            animation: border_anim 0.2s linear forwards;
            animation-delay: 1.5s;
        }
        .line2{
            position:absolute;
            top:-1px;
            left:101%;
            border:1px solid white;
            height:0;
            width: 0;
            transform: rotate(45deg);
            transform-origin: 0% 0%;
            animation: border_anim2 0.1s linear forwards;
            animation-delay: 1.7s;
        }

        @keyframes border_anim {
            0%{
                width: 0%;
            }
            100%{
                width: 100%;
            }
        }
        @keyframes border_anim2 {
            0%{
                width: 0%;
            }
            100%{
                width: 25%;
            }
        }

        .chart-status{
            position:absolute;
            width:100%;
            height:100%;
        }
        
        .assetInfo__lv--max {
            color: white;
            border-radius: 50px;
            background: linear-gradient(90deg, red, green, blue);
            font-size: 14px;
            height: 1.75em;
            line-height: 1;
            text-align: center;
            width: 50px;
            padding: .375em;
        }

        .asset_lvMax{
            border: 2px solid #da4033;
            border-radius: 4px;
            position: relative;
        }
        .asset_lvMax:after{
            color: white;
            border-radius: 50px;
            background: linear-gradient(90deg, red, green, blue);
            content: "Lv.Max";
            font-weight: bold;
            left: .7em;
            padding: .2em;
            position: absolute;
            top: -1em;
            width:70px;
            text-align:center;
            z-index:1;
        }

        // .assetSelector__assetInner{
        //     background: #282b33cc;
        // }        
	`;
document.head.appendChild(styleElem);
