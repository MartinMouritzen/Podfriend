class ActivityPub {
	/**
	* 
	*/
	static async __fetchAndReturn(uri) {
		var response;
		const headers = {
			'Accept': 'application/json'
		};

		try {
			response = await fetch(uri,{
				headers: headers
			});
		}
		catch (exception) {
			response = await fetch('https://www.podfriend.com/tmp/rssproxy.php?rssUrl=' + encodeURI(uri),{
				headers: headers
			});
		}
		const commentResponse = await response.json();

		// console.log('test1');
		// console.log(commentResponse);

		return commentResponse;
	}
	/**
	* 
	*/
	static async getUserForComment(uri) {
		// console.log('Getting user for: ' + uri);
		const rawUserInfo = await ActivityPub.__fetchAndReturn(uri);
		console.log(rawUserInfo);
		return {
			avatar: rawUserInfo.icon.url,
			username: rawUserInfo.preferredUsername
		};
	}
	static async getCommentInformation(uri) {
		return await ActivityPub.__fetchAndReturn(uri);
	}
	/**
	* 
	*/
	static async getComments(commentInfoResponse,pageNumber = 0) {
		if (commentInfoResponse.first) {
			const commentResponse = await ActivityPub.__fetchAndReturn(commentInfoResponse.first);

			if (commentResponse.orderedItems) {
				console.log('commentResponse.orderedItems');
				var comments = [];
				// var commentAuthorPromises = [];
				for (var i=0;i<commentResponse.orderedItems.length;i++) {
					// var authorPromise = ActivityPub.getUserForComment(commentResponse.orderedItems[i].attributedTo);
					var authorInfo = await ActivityPub.getUserForComment(commentResponse.orderedItems[i].attributedTo);
					// commentAuthorPromises.push(authorPromise);

					comments.push({
						content: commentResponse.orderedItems[i].content,
						from: authorInfo
					});
				}
				return comments;

				/*
				return Promise.all(commentAuthorPromises)
				.then((authors) => {
					console.log('authors');
					console.log(authors);
					return comments;
				});
				*/
			}
			else {
				console.log('no comments for the episode');
				return [];
			}
		}
		console.log('no first element for the comments.');
		return false;
	}
}
export default ActivityPub;