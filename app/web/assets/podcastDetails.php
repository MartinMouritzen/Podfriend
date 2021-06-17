<?php
require_once($_SERVER["DOCUMENT_ROOT"]."../library/cache/class.cache.php");

$podcastPath = substr($_SERVER["REQUEST_URI"],strlen("/podcast/"));

$pathFragments = explode("/",$podcastPath);
// $possibleEpisodeId = substr($podcastPath,strrpos("/",$podcastPath));
// $podcastPath = rtrim($podcastPath,"/");

$podcastPath = $pathFragments[0];
$episodeId = $pathFragments[1];

$cache = new Cache("podcast_cache",$_SERVER["DOCUMENT_ROOT"]."../cache/",".txt");

$title = "Podfriend Podcast Player";
$description = "The friendliest podcast app in the world.";
$hasEpisode = false;

$debug = true;

$shouldRedirect = false;

if($debug || !$cache->get($podcastPath, $return)) {
	$podcastItems = new Items("podcasts");
	
	if ($podcastPath) {
		if (is_numeric($podcastPath)) {
			$isItunesId = true;

			$itemSearchParams[] = [
				"attribute" => "itunesId",
				"value" => $podcastPath
			];
		}
		else if (substr($podcastPath,0,3) === "pi-") {
			$podcastIndexId = substr($podcastPath,3);
			$isPodcastIndexId = true;

			$itemSearchParams[] = [
				"attribute" => "podcastindexId",
				"value" => $podcastIndexId
			];
		}
		else {
			$itemSearchParams[] = [
				"attribute" => "path",
				"value" => $podcastPath
			];
		}
		list($podcast) = $podcastItems->get($itemSearchParams,["name","path","description","artworkUrl600"],["searchType" => "OR"]);
		
		$podcastName = $podcast["name"];
		$description = $podcast["description"] ? $podcast["description"] : $description;
		$image = $podcast["artworkUrl600"];
		
		$title = $podcastName ? $podcastName." podcast" : $title;
		
		if ($episodeId) {
			require_once($_SERVER["DOCUMENT_ROOT"]."../library/class.podcastservice.php");
			$podcastService = new PodcastService("podcastdirectory");
			$episodeInfo = $podcastService->lookUpEpisode($episodeId);

			if ($episodeInfo && $episodeInfo["episode"]["id"] == $episodeId) {
				$hasEpisode = true;
				
				$episodeTitle = $episodeInfo["episode"]["title"];
				$audioUrl = $episodeInfo["episode"]["enclosureUrl"];
				$image = $episodeInfo["episode"]["image"] ? $episodeInfo["episode"]["image"] : $image;

				$title = $title." : ".$episodeTitle;
			}
		}
		$title = $title." on Podfriend Podcast Player App.";
	}
}
if ($podcast["path"]) {
	$canonicalURL = "https://web.podfriend.com/podcast/".($podcast["path"] ? $podcast["path"]."/".$episodeId : "");
}

print "<title>".$title."</title>\n";
print "<meta name=\"description\" content=\"".$description."\">\n";
print "<meta property=\"og:title\" content=\"".$title."\">\n";
print "<meta property=\"og:description\" content=\"".$description."\">\n";
print "<meta property=\"og:image\" content=\"".($image ? $image : "https://".$_SERVER["HTTP_HOST"]."/images/app-preview.png")."\">\n";
if ($canonicalURL) {
	print "<link rel=\"canonical\" href=\"".$canonicalURL."\" />\n";
}

if ($hasEpisode) {
	print "<meta property=\"twitter:card\" content=\"player\" />\n";
	print "<meta property=\"twitter:player\" content=\"https://".$_SERVER["HTTP_HOST"]."/miniplayer/?episodeTitle=".htmlspecialchars($episodeTitle)."&podcastTitle=".htmlspecialchars($title)."&audioUrl=".htmlspecialchars($audioUrl)."\" />\n";
	print "<meta property=\"twitter:player:width\" content=\"400\" />\n";
	print "<meta property=\"twitter:player:height\" content=\"100\" />\n";
	print "<meta property=\"twitter:title\" content=\"".htmlspecialchars($episodeTitle)."\">\n";
	print "<meta property=\"twitter:site\" content=\"@GoPodfriend\">\n";
	print "<meta property=\"twitter:image\" content=\"".htmlspecialchars($image)."\" />\n";
}
?>