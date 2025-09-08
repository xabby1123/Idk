// Simple IPTV web player using xgplayer + xgplayer-hls.js
// Supports: Xtream Codes (fetch live list) and M3U playlists.
// NOTE: Many IPTV servers do not enable CORS. Use a CORS proxy if needed.

const $ = (s)=>document.querySelector(s);
const listEl = $('#list');
const nowPlaying = $('#nowPlaying');
let player;

// Tabs
document.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tabcontent').forEach(t=>t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

function clearList(){
  listEl.innerHTML='';
}

function addItem(title, url){
  const li = document.createElement('li');
  li.textContent = title;
  li.addEventListener('click', ()=> play(url, title));
  listEl.appendChild(li);
}

function play(url, title){
  nowPlaying.textContent = 'Now Playing: ' + title;
  if (player) { player.destroy(); player = null; }
  const HlsPlayer = window.HlsJsPlayer || window.HlsPlayer || null;
  if (HlsPlayer){
    player = new HlsPlayer({
      id: 'player',
      url,
      isLive: true,
      autoplay: true,
      playsinline: true,
      poster: 'assets/logo-xg.png',
      fitVideoSize: 'fixWidth',
      closeVideoDblclick: true,
    });
  } else {
    // Fallback to core Player (Safari iOS native HLS)
    player = new window.Player({
      id: 'player',
      url,
      autoplay: true,
      playsinline: true,
      poster: 'assets/logo-xg.png',
    });
  }
}

// Xtream: fetch live channels
$('#btn_xt_fetch').addEventListener('click', async ()=>{
  const host = $('#xt_host').value.trim();
  const user = $('#xt_user').value.trim();
  const pass = $('#xt_pass').value.trim();
  const cors = $('#cors_prefix').value.trim();
  if(!host || !user || !pass){ alert('Fill host/user/pass'); return; }

  const api = (cors||'') + `${host}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&action=get_live_streams`;
  clearList();
  listEl.innerHTML = '<li>Loading...</li>';

  try{
    const res = await fetch(api);
    if(!res.ok) throw new Error('HTTP '+res.status);
    const data = await res.json();
    listEl.innerHTML='';
    data.slice(0, 5000).forEach(ch=>{
      const title = ch.name || ('Live ' + ch.stream_id);
      const url = `${host}/live/${encodeURIComponent(user)}/${encodeURIComponent(pass)}/${ch.stream_id}.m3u8`;
      addItem(title, (cors||'') + url);
    });
    if(data.length===0) addItem('No live channels found','');
  } catch(e){
    console.error(e);
    listEl.innerHTML='';
    addItem('Failed to fetch channels (CORS likely). Try a proxy.','');
  }
});

// M3U: load and parse
$('#btn_m3u_load').addEventListener('click', async ()=>{
  const m3uUrl = $('#m3u_url').value.trim();
  const cors = $('#m3u_cors_prefix').value.trim();
  if(!m3uUrl){ alert('Enter M3U URL'); return; }
  const url = (cors||'') + m3uUrl;
  clearList();
  listEl.innerHTML = '<li>Loading M3U...</li>';
  try{
    const res = await fetch(url);
    if(!res.ok) throw new Error('HTTP '+res.status);
    const text = await res.text();
    listEl.innerHTML='';
    const lines = text.split(/\r?\n/);
    let currentTitle = null;
    for(const line of lines){
      if(line.startsWith('#EXTINF')){
        const idx = line.indexOf(',');
        currentTitle = idx >=0 ? line.substring(idx+1).trim() : 'Channel';
      } else if(line && !line.startsWith('#')){
        const streamUrl = line.trim();
        addItem(currentTitle || 'Channel', (cors||'') + streamUrl);
        currentTitle = null;
      }
    }
    if(!listEl.children.length){
      addItem('No items parsed from M3U (CORS or format?)','');
    }
  } catch(e){
    console.error(e);
    listEl.innerHTML='';
    addItem('Failed to load M3U (CORS likely). Try a proxy.','');
  }
});

// Persist minimal settings (optional enhancement left simple for privacy)
