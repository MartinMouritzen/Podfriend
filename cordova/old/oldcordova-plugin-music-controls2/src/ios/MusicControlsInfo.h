//
//  MusicControlsInfo.h
//
//
//  Created by Juan Gonzalez on 12/17/16.
//
//

#ifndef MusicControlsInfo_h
#define MusicControlsInfo_h

#import <Foundation/Foundation.h>

@interface MusicControlsInfo : NSObject {}

@property NSString * artist;
@property NSString * track;
@property NSString * album;
@property NSString * ticker;
@property NSString * cover;
@property NSUInteger duration;
@property NSUInteger elapsed;
@property bool isPlaying;
@property bool hasPrev;
@property bool hasNext;
@property bool hasSkipForward;
@property bool hasSkipBackward;
@property bool hasScrubbing;
@property NSUInteger skipForwardInterval;
@property NSUInteger skipBackwardInterval;
@property bool dismissable;

- (id) initWithDictionary: (NSDictionary *) dictionary;

@end

#endif /* MusicControlsInfo_h */
