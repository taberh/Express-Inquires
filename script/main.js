;(function(undefined) {
    
	var win    = this,
		doc    = win.document,
		SPACE  = '',
		STRING = 'string',

		txt = com = postId = SPACE,
		url = 'http://api.kuaidi100.com/api?id=d56af859f50086e3&com={com}&nu={postid}&show=0&muti=1&order=asc',

		STRING_TEMPLATE = {
			RESULT: '<li><span class="result_time">{time}</span><span class="result_msg">{context}</span></li>',
			HISTORY: '<li com="{com}" postid="{postid}"><span class="company f_left">{txt}</span><span class="waybill f_left">{postid}</span></li>'
		},

		$ = function(elem) {
			return typeof elem === STRING ? doc.getElementById(elem) : elem;
		},

		$Result  = $('result'),
		$Message = $('message'),
		$Loading = $('loading'),
		$PostId  = $('postid'),
		$More    = $('more'),
		$MoreList= $('more_list'),
		$Submit  = $('submit'),
		$Clear   = $('clear'),
		$ResultList = $('result_list'),
		$HistoryList = $('history_list'),
		$CompanyList = $('company_list'),

		forEach = function(list, func) {
			var l = list.length;
			if (!!l) {
				for ( ; l--; ) {
					func.call(list[l], list[l], l);
				}
			} else {
				func.call(list, list);
			}
		},

		template = function(templ, data) {
			var r = /\{([^\}]*)\}/g;
			
			return templ.replace(r, function(t, p) {
					if (data[p] !== undefined)
						return data[p];
					else
						return null;
				}
			);
		},

		DOM = {
			show: function(elem) {
				forEach(elem, function(elem) {
						elem.style.display = 'block';
					}
				);
			},
			hide: function(elem) {
				forEach(elem, function(elem) {
						elem.style.display = 'none';
					}
				);
			},
			html: function(elem, value) {
				if (!!elem) {
					if (value !== undefined)
						elem.innerHTML = value;
					else
						return elem.innerHTML;
				}
			}
		},

		history_data = { },
		
		History = (function() {
			var data = [],
				MAX  = 4,
				prop = 'HistoryDataList',
				TEMPLATE = STRING_TEMPLATE.HISTORY,	$Wrap;

			function _checkIsExist(value) {
				var l = data.length, k, j = 0;

				for ( ; l--; ) {
					for (k in data[l]) {
						if (data[l][k] === value[k])
							j++;
					}
					if (j > 1)
						return l;
					else
						j = 0;
				}

				return -1;
			};

			function _checkMax() {
				if (data.length > MAX)
					data.shift();
			};

			function init(elem) {
				$Wrap = elem;
			};

			function add(value) {
				if (_checkIsExist(value) === -1) {				
					data[data.length] = value;
					_checkMax();

					localStorage.setItem(prop, JSON.stringify(data));
					DOM.html($Wrap, template(TEMPLATE, value) + DOM.html($Wrap));
				}
			};

			function del() {
				localStorage.setItem(prop, null);
				DOM.html($Wrap, SPACE);
			};

			function get() {
				return data = JSON.parse(localStorage.getItem(prop)) || [];
			};
			
			return {
				init: init,
				add: add,
				del: del,
				get: get
			}
		}())
	;

	init();

	function init() {		
		bind();
		printHistoryList();
		History.init($HistoryList);
		win.request = request;
	};

	function bind() {
		var EventClick = 'click';

		$Clear.addEventListener(EventClick, History.del);
		$Submit.addEventListener(EventClick, request);
		$CompanyList.addEventListener(EventClick, clickCompanyList);
		$HistoryList.addEventListener(EventClick, clickHistoryList);
	};

	function showHistoryList() {
		doc.body.className = 'broad';
		DOM.show(doc.getElementsByClassName('f_right')[0]);
	};

	function printHistoryList() {
		var d = History.get(),
			l = d.length,
			h = SPACE;
		
		if (l > 0) {
			showHistoryList();

			for ( ; l--; ) {
				h += template(STRING_TEMPLATE.HISTORY, d[l]);
			}
			DOM.html($HistoryList, h);
		}
	};

	function clickCompanyList(e) {
		var target = e.target;

		while (target.tagName !== 'INPUT') {
			target = target.childNodes[0];
		}

		target.checked = true;
		com = target.value;
		txt = target.nextSibling.nodeValue;
	};

	function clickHistoryList(e) {
		var target = e.target;

		while (target.tagName !== 'LI') {
			target = target.parentNode;
		}

		com = target.getAttribute('com');
		$(com).checked = true;
		$PostId.value = target.getAttribute('postid');
		request();
	};

	function check() {
		if (com === SPACE || $PostId.value === SPACE)
			return false;

		return true;
	};

	function request() {
		var xhr   = new XMLHttpRequest(),
			timer = null,
			delay = 20000,
			_data = {
				com: com,
				postid: $PostId.value
			},
			_url  = template(url, _data)
		;

		if (!check()) {
			setMessage('请选择快递公司或输入正确的单号！');
			return false;
		}

		history_data = _data;
		history_data.txt = txt;

		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				xhr.onreadystatechange = null;
				resetPageStatus();
				clearTimeout(timer);

				if (xhr.status === 200) {
					success(xhr.responseText);
				}
				else {
					error(xhr);
				}
			}
		};
		xhr.open('GET', _url, true);
		xhr.send();

		timer = setTimeout(function() {
			timeout();
			xhr.onreadystatechange = null;
		}, delay);

		queryIng();

		return false;
	};

	function success(result) {
		var h = SPACE, d;

		result = eval('(' + result + ')');
		d      = result.data;

		if ( (!!d && d.length == 0) || !!result)
			setMessage('没有查到相关单号的信息！');

		if (result.status == 0)
			setMessage(result.message);
		
		if (result.status == 1 && !!d && d.length > 0) {
			forEach(d, function(data) {
					h += template(STRING_TEMPLATE.RESULT, data);
				}
			);

			resetPageStatus();
			DOM.html($ResultList, h);
			DOM.show($Result);
			History.add(history_data);
			showHistoryList();
		}
	};

	function timeout() {
		setMessage('查询超时！');
	};

	function error(e) {
		setMessage('查询出错！');
	};

	function resetPageStatus() {
		DOM.hide([$Result, $Message, $Loading]);
		
		$PostId.disabled = false;
		$PostId.style.backgroundColor = SPACE;

		$Submit.value = '查 询';
		$Submit.disabled = false;
	};

	function queryIng() {
		DOM.show($Loading);
		DOM.hide([$Result, $Message]);

		$PostId.disabled = true;
		$PostId.style.backgroundColor = '#f3f3f3';

		$Submit.value = '查询中';
		$Submit.disabled = true;
	};

	function setMessage(value) {
		resetPageStatus();
		DOM.html($Message, value);
		DOM.show($Message);
	};

}).apply(window);