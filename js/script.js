var page=0, limit=10;
var commentbody="";

var disqus_shortname = "";
var disqus_identifier = "";
var disqus_url = "";


$(document).ready(function(){
    commentbody = $("#bodycomment").html();
    $("#bodycomment").html("");
    
    $("#nextpagination").click(function(){
        $("#nextpagination").addClass("ui-disabled");
        $("#prevpagination").addClass("ui-disabled");
        fetchNews(page+=limit);
    });
    $("#prevpagination").click(function(){
        $("#nextpagination").addClass("ui-disabled");
        $("#prevpagination").addClass("ui-disabled");
        if(page<limit)
        {
            page=limit;
        }
        fetchNews(page-=limit);
    });
    $(document).on("click","#articlelist li",function(e){
        $.mobile.loading('show');
        e.preventDefault();
        $.getJSON("http://www.quezon.gov.ph/json/?callback=?",
        {
            "id": $(this).attr("data-articleid")
        },displayNews);
    });
    
    
    $("#nextpagination").addClass("ui-disabled");
    $("#prevpagination").addClass("ui-disabled");
    fetchNews(page);
});

function fetchNews(p){
    $.mobile.loading('show');
    $.getJSON("http://www.quezon.gov.ph/json/?callback=?",
        {
            "page": p,
            "limit": limit
        },refreshNewsList);
}
function refreshNewsList(data)
{
    $("#content").html('<ul data-role="listview" id="articlelist"></ul>');
    $.each(data.items,function(i,item){
        var lst = $("<li data-articleid='"+item.id+"'></li>").appendTo($("#articlelist"));
        lst = $('<a href="#newsContent" title="'+(item.title!==null?item.title:item.body.toString().replace(/(<([^>]+)>)/ig,"").substr(0,100).trim())+'"></a>').appendTo(lst);
        if(item.img !== "")
        {
            var imglist = item.img.split(",");
            var url = encodeURIComponent('http://www.quezon.gov.ph/news2010/images/092010/' + imglist[1]);
            lst.append('<img src="http://www.quezon.gov.ph/timthumb.php?w=80&amp;h=80&amp;q=60&amp;src='+url+'" alt="'+item.title+'"/>');
        }
        else
        {
            lst.append('<img src="http://www.quezon.gov.ph/images/quezonseal.png" alt="'+item.title+'"/>');
        }
        lst.append('<h2>'+(item.title!==null?item.title:item.body.toString().replace(/(<([^>]+)>)/ig,"").substr(0,100).trim())+'</h2>');
        lst.append('<p>'+item.body.toString().replace(/(<([^>]+)>)/ig,"").substr(0,250).trim()+'&hellip;</p>');
    });
    $("#content").trigger("create");
    $("#nextpagination").removeClass("ui-disabled");
    if(page>=limit){
        $("#prevpagination").removeClass("ui-disabled");
    }
    $.mobile.loading('hide');
}

function displayNews(data){
$.each(data.items,function(i,item){
    $("#bodycomment").html("");
    $("#dsqnode").remove();
    $("#bodycontent").html("<h1>"+item.title+"</h1>");
    pdate = new Date(item.pubdate);
    $("#bodycontent").append("<div class='newsmeta'>"+item.author+" "+pdate.toLocaleString()+"</div>");
    $("#bodycontent").append("<div id='bodynewscontent'></div>");
    if(item.img !== "")
    {
        var imglist = item.img.split(",");
        $.each(imglist,function(i, img){
            if(img!=""){
                $("#bodynewscontent").append("<img src='http://www.quezon.gov.ph/news2010/images/092010/"+img+"' alt='Image'/>");
            }
        });   
    }
    $("#bodycontent").append(item.body);
    $("#bodycomment").html(commentbody);
    $("#bodycomment").each(function() {
        var txt = $(this).html();
        txt = txt.replace(/\${id}/g, item.id);
        $(this).html(txt);
    });
    initializeDisqus(item.id);
});
$.mobile.changePage("#newsContent");
$.mobile.loading('hide');
}

function initializeDisqus(newsid)
{
    /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
    disqus_shortname = 'quezonprovince'; // required: replace example with your forum shortname

    // The following are highly recommended additional parameters. Remove the slashes in front to use.
    disqus_identifier = 'news/'+newsid+'/';
    disqus_url = 'http://www.quezon.gov.ph/news/'+newsid+'/-province-award-best-performing-barangays-on-mangrove-maintenance-and-protection/';

    /* * * DON'T EDIT BELOW THIS LINE * * */
    (function() {
        DISQUS = null;
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true; dsq.id="dsqnode";
        dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();
}