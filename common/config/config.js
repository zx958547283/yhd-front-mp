export default {
	// http://192.168.4.47:8088/eoms/
	// https://www.laohaowaner.com/qbeoms_test/
	// contextPath: "https://www.laohaowaner.com/qbeoms/",
	contextPath: "https://jk.laohaowaner.com/yhd_eoms_pre/",
	// contextPath: "http://192.168.7.209:8088/eoms/",
	// contextPath: "http://192.168.7.197:8088/eoms/",
	// contextPath: "http://192.168.7.192:8088/eoms/",
	// contextPath: "http://192.168.31.138:8088/eoms/",
	// contextPath: "https://jk.laohaowaner.com/qbeoms/",
	// contextPath: process.env.NODE_ENV === 'production' ? "https://www.laohaowaner.com/qbeoms_test/" : "http://story-has-you.natapp1.cc/eoms/",
	// contextPath: process.env.NODE_ENV === 'production' ? "https://www.laohaowaner.com/qbeoms/" : "http://192.168.31.138:8088/eoms/",
	CreateQrCodeHead: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1df3c52649c84c11&redirect_uri=',
	CreateQrCodeBody: 'https://www.laohaowaner.com/qbxtfront/#/',
	// CreateQrCodeBody: 'https://jk.laohaowaner.com/qbxtfront/#/',
	CreateQrCodeEnd: '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect',
	shareCommonInfo: {
		title: "再不学习我们就老了~",
		path: "/pages/blank",
		imageUrl: ""
	}
};
