(function(doc, undefined) {

  var fullCompanyElem = doc.getElementById("fullCompany"), 
    desktopCompanyElem = doc.getElementById("desktopCompany"), 
    historyQueryElem = doc.getElementById("historyQuery"), 
    searchInputElem = doc.querySelector("#keyword"), 
    loadingElem = doc.getElementById("loading"), 
    resultElem = doc.getElementById("result"), 
    resultItemElem = resultElem.getElementsByTagName("ul")[0], 
    moreElem = doc.querySelector("#more button"),       
		
    HistoryData;
    
	function template(tpl, data) {
    var r = /\{([^\}]*)\}/g;
    return tpl.replace(r, function(t, p) {
      if (data[p] !== undefined) {
        return data[p];
      } else {
        return null;
      }
    });
  };

  function init() {
    renderCompanyList();
    HistoryData.init();
    bind();
  };

  HistoryData = {
    TPL: '<li code="{code}" name="{name}" ticket="{ticket}" title="{name} 单号：{ticket}" class="clearfix"><span>{note}</span><b>{date}</b></li>',
			
		init: function() {
      this.data = JSON.parse(localStorage.getItem("historyData"));
      this.data ? this.render(this.data) : void 0;
    },
				
		add: function(code, ticket, name, note) {
      this.data = this.data || [];
      this.data.unshift({code: code,name: name,ticket: ticket,note: note,date: (new Date()).toJSON()});
      this.data.length > 5 ? this.data.splice(5) : void 0;
      localStorage.setItem("historyData", JSON.stringify(this.data));
      this.render(this.data[0]);
    },
				
		clear: function() {
      var aside = doc.querySelector("aside");
      aside.style.display = "none";
      historyQueryElem.innerHTML = "";
      delete this.data;
      localStorage.setItem("historyData", null);
    },
				
		render: function(data) {
      var fragment = "", self = this;
      if (Object.prototype.toString.call(data) === "[object Object]") {
        fragment = template(this.TPL, {code: data.code,name: data.name,date: formatDate(data.date),ticket: data.ticket,note: data.note});
      } else {
        data.forEach(function(obj, i) {
          fragment += template(self.TPL, {code: obj.code,name: obj.name,date: formatDate(obj.date),ticket: obj.ticket,note: obj.note});
        });
      }
      historyQueryElem.innerHTML = fragment + historyQueryElem.innerHTML;
      historyQueryElem.children.length > 5 ? historyQueryElem.removeChild(historyQueryElem.lastChild) : void 0;
      historyQueryElem.parentNode.style.display = "block";
      doc.body.style.width = "463px";
    }
	};

  function renderCompanyList() {
    var TPL_COMPANY = '<li cid="{id}" code="{code}"><input id="company-{id}" type="radio" name="company" /><label for="company-{id}">{name}</label></li>', 
			companyItem = [
				{id: 29,code: "shunfeng",name: "顺丰速运"}, 
				{id: 43,code: "yuantong",name: "圆通速递"}, 
				{id: 28,code: "shentong",name: "申通快递"}, 
				{id: 56,code: "zhaijisong",name: "急宅送"}, 
				{id: 32,code: "tiantian",name: "天天快递"}, 
				{id: 24,code: "fedex",name: "FedEx"}, 
				{id: 12,code: "ems",name: "EMS"}, 
				{id: 7,code: "dhl",name: "DHL"}, 
				{id: 1,code: "aae",name: "AAE"}, 
				{id: 2,code: "anxinda",name: "安信达"}, 
				{id: 3,code: "anjie",name: "安捷快递"}, 
				{id: 4,code: "bht",name: "BHT"}, 
				{id: 8,code: "dsukuaidi",name: "D速快递"}, 
				{id: 9,code: "dpex",name: "DPEX"}, 
				{id: 10,code: "datianwuliu",name: "大田快递"}, 
				{id: 11,code: "debangwuliu",name: "德邦快递"}, 
				{id: 13,code: "feikangda",name: "飞康达"}, 
				{id: 14,code: "guangdongyouzhengwuliu",name: "广东邮政"}, 
				{id: 15,code: "ganzhongnengda",name: "港中能达"}, 
				{id: 16,code: "huitongkuaidi",name: "汇通快递"}, 
				{id: 17,code: "jinguangsudikuaijian",name: "京广快递"}, 
				{id: 18,code: "jjwl",name: "佳吉快递"}, 
				{id: 19,code: "jiayiwuliu",name: "佳怡"}, 
				{id: 20,code: "jixinda",name: "急先达"}, 
				{id: 21,code: "kuaijiesudi",name: "快捷速运"}, 
				{id: 25,code: "minghangkuaidi",name: "民航快递"}, 
				{id: 26,code: "peisihuoyunkuaidi",name: "配思快运"}, 
				{id: 27,code: "quanyikuaidi",name: "全一快递"}, 
				{id: 31,code: "suer",name: "速尔快递"}, 
				{id: 34,code: "tnt",name: "TNT快递"}, 
				{id: 35,code: "ups",name: "UPS"}, 
				{id: 36,code: "wxwl",name: "万象快递"}, 
				{id: 37,code: "wxwl",name: "伍圆快递"}, 
				{id: 40,code: "xinbangwuliu",name: "新邦快递"}, 
				{id: 41,code: "xinfengwuliu",name: "信丰快递"}, 
				{id: 42,code: "yafengsudi",name: "亚风快递"}, 
				{id: 44,code: "youshuwuliu",name: "优速快递"}, 
				{id: 46,code: "yibangwuliu",name: "一邦快递"}, 
				{id: 48,code: "yuefengwuliu",name: "越丰快递"}, 
				{id: 50,code: "yuanzhijiecheng",name: "元智捷诚"}, 
				{id: 51,code: "yunda",name: "韵达快运"}, 
				{id: 52,code: "youzhengguoji",name: "挂号信"}, 
				{id: 53,code: "zhongtiewuliu",name: "中铁快运"}, 
				{id: 54,code: "zhongyouwuliu",name: "中邮物流"}, 
				{id: 55,code: "zhongtong",name: "中通速递"}
			], 
			desktopCompanyIndexs = localStorage.getItem("desktopCompanyIndexs") || "",
			fullFragment = desktopFragment = "", 
			desktopItem = [], 
			filter = function(a) {
				return a;
			};

      desktopCompanyIndexs = desktopCompanyIndexs.split(",");
      desktopCompanyIndexs = desktopCompanyIndexs.filter(filter);

    companyItem.forEach(function(obj, i) {
      var index = desktopCompanyIndexs.indexOf("" + obj.id);
      if (index > -1) {
          desktopCompanyIndexs[index] = i;
      }
    });

    desktopCompanyIndexs.forEach(function(index, i) {
      desktopItem[i] = companyItem[index];
    });
    desktopCompanyIndexs.forEach(function(index) {
      companyItem.splice(index, 1, null);
    });

    companyItem = desktopItem.concat(companyItem);
    companyItem = companyItem.filter(filter);
    companyItem.forEach(function(obj, i) {
      var fragment = template(TPL_COMPANY, obj);
      if (i < 6) {
          desktopFragment += fragment;
      } else {
          fullFragment += fragment;
      }
    });

    fullCompanyElem.innerHTML = fullFragment;
    desktopCompanyElem.innerHTML = desktopFragment;
  };

  function bind() {
    var clearElem = doc.querySelector("#clear button"), 
      searchButtonElem = doc.querySelector("#search button");

    function query(e) {
      if (e.keyCode === 13) {
          submit(e);
      }
    };

    clearElem.addEventListener("click", HistoryData.clear, false);
    searchButtonElem.addEventListener("click", submit, false);
    fullCompanyElem.addEventListener("click", selectCompany, false);
    searchInputElem.addEventListener("keydown", query, false);
    doc.querySelector('#notes').addEventListener('keydown', query, false);
    moreElem.addEventListener("click", function(e) {
      window.getComputedStyle(fullCompanyElem, null).display === "none" ? 
          (fullCompanyElem.style.display = "block", this.innerHTML = "【收起】") : 
          (fullCompanyElem.style.display = "none", this.innerHTML = "【查看全部】");
    }, false);
    desktopCompanyElem.addEventListener("click", function(e) {
      var target = e.target;
      if (/INPUT/.test(target.tagName)) {
        setCompany(target.nextSibling.innerHTML, target.parentNode.getAttribute("code"));
        searchInputElem.select();
        fullCompanyElem.style.display = "none";
        moreElem.innerHTML = '【查看全部】';
      }
    }, false);
    historyQueryElem.addEventListener("click", function(e) {
      var target = e.target, name, code, ticket;
      while (target.tagName !== "LI") {
        if (target === doc.body) {
            break;
        }
        target = target.parentNode;
      }
      
      name = target.getAttribute("name");
      code = target.getAttribute("code");
      ticket = target.getAttribute("ticket");
      searchInputElem.value = ticket;
      setCompany(name, code);
      queryData(code, ticket);
    }, false);
  };

  function tips(msg) {
      doc.getElementById("tips").innerHTML = msg;
      loadingElem.style.display = "none";
  };

  function queryData(code, ticket, callback) {
    var url = "http://api.kuaidi100.com/api?id=d56af859f50086e3&com={code}&nu={ticket}&show=0&muti=1&order=asc";
    
    if (code === "ems") {
      url = "http://express.yesnap.com/model/ajax.php?type=s001&no={ticket}";
    }

    loadingElem.style.display = "block";
    resultElem.style.display = "none";
    resultItemElem.innerHTML = "";
    doc.getElementById("tips").innerHTML = "";

    ajax({
      url: template(url, {code: code,ticket: ticket}),
      success: function(result) {
        if (code === 'ems') {
          result = processEmsResult(result);
        }
        else {
          result = eval("(" + result + ")");
        }

        loadingElem.style.display = "none";

        if (result.data && result.data.length) {
          printResult(result.data);
          Object.prototype.toString.call(callback) === "[object Function]" ? callback(result) : void 0;
          return;
        }

        tips(result.message || "暂时未查到相关信息，请稍后再试！");
      },
      error: tips
    });
  };

  function processEmsResult(html) {
    var div, tr, td, result = {};

    if (html.indexOf('table') > -1) {
      div = document.createElement('div');
      div.innerHTML = html;    
      tr = div.getElementsByTagName('tr');
      result.data = [];
      
      for (var i = 1, len = tr.length; i < len; i++) {
        td = tr[i].getElementsByTagName('td');

        result.data.push({
          time: (td[0].innerHTML).trim(),
          context: (td[2].innerHTML).trim()
        });
      }
    }
    else {
      result.message = html.replace(/\<[^\>]*\>/g, '');
    }
    
    return result;
  };

  function submit(e) {
    var code, ticket, 
      thumb = doc.querySelector("#thumbnav em"),
      note = doc.querySelector('#notes');

    code = thumb.getAttribute("code");

    if (!code) {
      tips("请选择您要查询的快递公司！");
      return;
    }

    ticket = searchInputElem.value;

    if (!ticket) {
      tips("请输入您要查询的单号！");
      return;
    }

    tips("");

    queryData(code, ticket, function(result) {
      HistoryData.add(code, ticket, thumb.innerHTML, note.value || thumb.innerHTML);
    });
  };

  function ajax(params) {
    var xhr = new XMLHttpRequest(), timer;

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
          clearTimeout(timer);
          xhr.onreadystatechange = null;
          xhr.status === 200 ? 
            params.success(xhr.responseText) : 
            params.error(xhr.responseText);
      }
    };

    xhr.open("get", params.url, true);
    xhr.send();

    timer = setTimeout(function() {
        xhr.onreadystatechange = null;
        params.error("请求超时！");
    }, params.timeout || 20000);
  };

  function selectCompany(e) {
    var target = e.target, 
      desktopCompanyIndexs, cid, parentNode;

    if (/INPUT/.test(target.tagName)) {
      parentNode = target.parentNode;

      fullCompany.style.display = "none";
      moreElem.innerHTML = "【查看全部】";

      desktopCompany.insertBefore(parentNode, desktopCompany.children[0]);
      fullCompany.insertBefore(desktopCompany.lastElementChild, fullCompany.children[0]);

      desktopCompanyIndexs = localStorage.getItem("desktopCompanyIndexs");
      cid = parentNode.getAttribute("cid");

      if (desktopCompanyIndexs) {
        desktopCompanyIndexs = desktopCompanyIndexs.split(",");
        desktopCompanyIndexs.unshift(cid);

        if (desktopCompanyIndexs.length > 6) {
          desktopCompanyIndexs.splice(5);
        }
      } else {
          desktopCompanyIndexs = [cid];
      }

      localStorage.setItem("desktopCompanyIndexs", desktopCompanyIndexs.join(","));

      setCompany(target.nextSibling.innerHTML, target.parentNode.getAttribute("code"));

      searchInputElem.select();
    }
  };

  function formatDate(data) {
    var old = new Date(data), 
      now = new Date(), 
      time, ret, d, h, m;

    time = (now.getTime() - old.getTime()) / 1000;

    if (time >= 86400) {
      d = Math.floor(time / 86400);
      time -= d * 86400;
    }
    if (d >= 3) {
      return (old.getMonth() + 1) + "-" + old.getDate() + " " + old.toLocaleTimeString();
    } else {
      if (d === 2) {
          return "前天";
      } else {
          if (d === 1) {
              return "昨天";
          }
      }
    }

    if (time >= 3600) {
      h = Math.floor(time / 3600);
      time -= h * 3600;
    }

    if (h > 0) {
      return h + "小时前";
    }

    if (time >= 60) {
      m = Math.floor(time / 60);
      time -= m * 60;
    }

    if (m > 0) {
      return m + "分钟前";
    }

    return "刚刚";
  };

  function setCompany(name, code) {
    var thumbnav = doc.getElementById("thumbnav"), 
      em = thumbnav.getElementsByTagName("em")[0];

    em.innerHTML = name;
    em.setAttribute("code", code);
    thumbnav.style.display = "block";
  };

  function printResult(data) {
    var fragment = "", 
      TPL_RESULT = '<li class="clearfix"><span class="time">{time}</span><span class="content">{context}</span></li>';

    data.forEach(function(obj) {
        fragment += template(TPL_RESULT, obj);
    });

    resultItemElem.innerHTML = fragment;
    resultElem.style.display = "block";
    doc.body.style.width = "463px";
  }

  return {
    init: init
  };

}(document)).init();