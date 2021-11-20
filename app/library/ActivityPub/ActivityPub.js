class ActivityPub {
	/**
	* 
	*/
	static async __fetchAndReturn(uri) {
		var response;
		const headers = {
			'Accept': 'application/activity+json'
		};

		try {
			console.log('Fetching comment URI: ' + uri);
			response = await fetch(uri,{
				headers: headers
			});
		}
		catch (exception) {
			console.log('Failed fetch. Trying proxy: ' + 'https://api.podfriend.com/proxy.php?rssUrl=' + encodeURI(uri));

			try {
				response = await fetch('https://api.podfriend.com/proxy.php?rssUrl=' + encodeURI(uri),{
					headers: headers
				});
				console.log(response);
				// Fails here... CORS?
			}
			catch (exception2) {
				console.log('Proxy failed');
				console.log(exception2);
			}
		}
		const commentResponse = await response.json();

		console.log('test1');
		console.log(commentResponse);

		return commentResponse;
	}
	/**
	* 
	*/
	static async getUserForComment(uri) {
		// console.log('Getting user for: ' + uri);
		const rawUserInfo = await ActivityPub.__fetchAndReturn(uri);
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
		if (commentInfoResponse.replies) {
			console.log('Getting commentResponse');
			const commentResponse = await ActivityPub.__fetchAndReturn(commentInfoResponse.replies.first.next);
			console.log(commentResponse);

			if (commentResponse.first.items) {
				console.log('commentResponse.first.items');
				console.log(commentResponse.first.items);
				var comments = [];
				// var commentAuthorPromises = [];
				for (var i=0;i<commentResponse.first.items.length;i++) {
					if (commentResponse.first.items[i].attributedTo) {
						// var authorPromise = ActivityPub.getUserForComment(commentResponse.orderedItems[i].attributedTo);
						var authorInfo = await ActivityPub.getUserForComment(commentResponse.first.items[i].attributedTo);
						// commentAuthorPromises.push(authorPromise);

						console.log(authorInfo);

						comments.push({
							content: commentResponse.first.items[i].content,
							from: authorInfo
						});
					}
				}
				console.log('Comments!');
				console.log(comments);
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