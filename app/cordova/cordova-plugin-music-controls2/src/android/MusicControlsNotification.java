package com.homerours.musiccontrols;

import org.apache.cordova.CordovaInterface;


import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.File;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Random;

import android.util.Log;
import android.R;
import android.content.Context;
import android.app.Activity;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Bundle;
import android.os.Build;
import android.graphics.BitmapFactory;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.Uri;

import android.support.v4.media.session.MediaSessionCompat;

import android.app.NotificationChannel;

import androidx.core.app.NotificationCompat;
import androidx.media.app.NotificationCompat.MediaStyle;

public class MusicControlsNotification {
	private Activity cordovaActivity;
	private NotificationManager notificationManager;
	private NotificationCompat.Builder notificationBuilder;
	private int notificationID;
	protected MusicControlsInfos infos;
	private Bitmap bitmapCover;
	private String CHANNEL_ID;
	
	private MediaSessionCompat mediaSessionCompat;

	// Public Constructor
	public MusicControlsNotification(Activity cordovaActivity,int id,MediaSessionCompat mediaSessionCompat){
		this.CHANNEL_ID ="cordova-music-channel-id";
		this.notificationID = id;
		this.cordovaActivity = cordovaActivity;
		Context context = cordovaActivity;
		this.notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
		this.mediaSessionCompat = mediaSessionCompat;

		// use channelid for Oreo and higher
		if (Build.VERSION.SDK_INT >= 26) {
			// The user-visible name of the channel.
			CharSequence name = "Audio Controls";
			// The user-visible description of the channel.
			String description = "Control Playing Audio";

			int importance = NotificationManager.IMPORTANCE_LOW;

			NotificationChannel mChannel = new NotificationChannel(this.CHANNEL_ID, name,importance);

			// Configure the notification channel.
			mChannel.setDescription(description);

			this.notificationManager.createNotificationChannel(mChannel);
    }

	}

	// Show or update notification
	public void updateNotification(MusicControlsInfos newInfos){
		// Check if the cover has changed	
		if (!newInfos.cover.isEmpty() && (this.infos == null || !newInfos.cover.equals(this.infos.cover))){
			this.getBitmapCover(newInfos.cover);
		}
		this.infos = newInfos;
		this.createBuilder();
		Notification noti = this.notificationBuilder.build();
		this.notificationManager.notify(this.notificationID, noti);
		this.onNotificationUpdated(noti);
		
		// updateNotificationMediaStyle();
	}
	/*
   private void updateNotificationMediaStyle() {
        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.M) {
            MediaStyle style = new MediaStyle();
            
            // MediaSession session = MediaSessionCompat.getMediaSession();
            style.setMediaSession(this.mediaSessionCompat.getSessionToken());

            int controlCount = 0;
            if(hasControl(PlaybackStateCompat.ACTION_PLAY) || hasControl(PlaybackStateCompat.ACTION_PAUSE) || hasControl(PlaybackStateCompat.ACTION_PLAY_PAUSE)) {
                controlCount += 1;
            }
            if(hasControl(PlaybackStateCompat.ACTION_SKIP_TO_NEXT)) {
                controlCount += 1;
            }
            if(hasControl(PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS)) {
                controlCount += 1;
            }
            if(hasControl(PlaybackStateCompat.ACTION_FAST_FORWARD)) {
                controlCount += 1;
            }
            if(hasControl(PlaybackStateCompat.ACTION_REWIND)) {
                controlCount += 1;
            }
            int[] actions = new int[controlCount];
            for(int i=0; i<actions.length; i++) {
                actions[i] = i;
            }
            style.setShowActionsInCompactView(actions);
            nb.setStyle(style);
        }
    }
    */

	// Toggle the play/pause button
	public void updateIsPlaying(boolean isPlaying){
		this.infos.isPlaying=isPlaying;
		this.createBuilder();
		Notification noti = this.notificationBuilder.build();
		this.notificationManager.notify(this.notificationID, noti);
		this.onNotificationUpdated(noti);
	}

	// Toggle the dismissable status
	public void updateDismissable(boolean dismissable){
		this.infos.dismissable=dismissable;
		this.createBuilder();
		Notification noti = this.notificationBuilder.build();
		this.notificationManager.notify(this.notificationID, noti);
		this.onNotificationUpdated(noti);
	}

	// Get image from url
	private void getBitmapCover(String coverURL){
		try{
			if(coverURL.matches("^(https?|ftp)://.*$"))
				// Remote image
				this.bitmapCover = getBitmapFromURL(coverURL);
			else{
				// Local image
				this.bitmapCover = getBitmapFromLocal(coverURL);
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	// get Local image
	private Bitmap getBitmapFromLocal(String localURL){
		try {
			Uri uri = Uri.parse(localURL);
			File file = new File(uri.getPath());
			FileInputStream fileStream = new FileInputStream(file);
			BufferedInputStream buf = new BufferedInputStream(fileStream);
			Bitmap myBitmap = BitmapFactory.decodeStream(buf);
			buf.close();
			return myBitmap;
		} catch (Exception ex) {
			try {
				InputStream fileStream = cordovaActivity.getAssets().open("www/" + localURL);
				BufferedInputStream buf = new BufferedInputStream(fileStream);
				Bitmap myBitmap = BitmapFactory.decodeStream(buf);
				buf.close();
				return myBitmap;
			} catch (Exception ex2) {
				ex.printStackTrace();
				ex2.printStackTrace();
				return null;
			}
		}
	}

	// get Remote image
	private Bitmap getBitmapFromURL(String strURL) {
		try {
			URL url = new URL(strURL);
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setDoInput(true);
			connection.connect();
			InputStream input = connection.getInputStream();
			Bitmap myBitmap = BitmapFactory.decodeStream(input);
			return myBitmap;
		} catch (Exception ex) {
			ex.printStackTrace();
			return null;
		}
	}

	private void createBuilder(){
		Context context = cordovaActivity;
		NotificationCompat.Builder builder = new NotificationCompat.Builder(context);

		// use channelid for Oreo and higher
		if (Build.VERSION.SDK_INT >= 26) {
			builder.setChannelId(this.CHANNEL_ID);
		}
		
		int podfriendBlueRaw = Color.parseColor("#0176e5");
		// Color podfriendBlue =Color.valueOf(podfriendBlueRaw);
		builder.setColor(podfriendBlueRaw);
		
		builder.setColorized(true);

		//Configure builder
		builder.setContentTitle(infos.track);
		if (!infos.artist.isEmpty()){
			builder.setContentText(infos.artist);
		}
		builder.setWhen(0);

		// set if the notification can be destroyed by swiping
		if (infos.dismissable){
			builder.setOngoing(false);
			Intent dismissIntent = new Intent("music-controls-destroy");
			PendingIntent dismissPendingIntent = PendingIntent.getBroadcast(context, 1, dismissIntent, 0);
			builder.setDeleteIntent(dismissPendingIntent);
		} else {
			builder.setOngoing(true);
		}
		if (!infos.ticker.isEmpty()){
			builder.setTicker(infos.ticker);
		}
		
		builder.setPriority(Notification.PRIORITY_MAX);

		//If 5.0 >= set the controls to be visible on lockscreen
		if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP){
			builder.setVisibility(Notification.VISIBILITY_PUBLIC);
		}

		//Set SmallIcon
		boolean usePlayingIcon = infos.notificationIcon.isEmpty();
		if(!usePlayingIcon){
			int resId = this.getResourceId(infos.notificationIcon, 0);
			usePlayingIcon = resId == 0;
			if(!usePlayingIcon) {
				builder.setSmallIcon(resId);
			}
		}

		if(usePlayingIcon){
			if (infos.isPlaying){
				builder.setSmallIcon(this.getResourceId(infos.playIcon, android.R.drawable.ic_media_play));
			} else {
				builder.setSmallIcon(this.getResourceId(infos.pauseIcon, android.R.drawable.ic_media_pause));
			}
		}

		//Set LargeIcon
		if (!infos.cover.isEmpty() && this.bitmapCover != null){
			builder.setLargeIcon(this.bitmapCover);
		}

		//Open app if tapped
		Intent resultIntent = new Intent(context, cordovaActivity.getClass());
		resultIntent.setAction(Intent.ACTION_MAIN);
		resultIntent.addCategory(Intent.CATEGORY_LAUNCHER);
		PendingIntent resultPendingIntent = PendingIntent.getActivity(context, 0, resultIntent, 0);
		builder.setContentIntent(resultPendingIntent);

		//Controls
		int nbControls=0;
		/* Previous  */
		if (infos.hasPrev){
			nbControls++;
			Intent previousIntent = new Intent("music-controls-previous");
			PendingIntent previousPendingIntent = PendingIntent.getBroadcast(context, 1, previousIntent, 0);
			builder.addAction(this.getResourceId(infos.prevIcon, android.R.drawable.ic_media_previous), "", previousPendingIntent);
		}
		
		nbControls++;
		Intent backwardIntent = new Intent("music-controls-backward");
		PendingIntent backwardPendingIntent = PendingIntent.getBroadcast(context, 1, backwardIntent, 0);
		builder.addAction(this.getResourceId(infos.nextIcon, android.R.drawable.ic_media_rew), "", backwardPendingIntent);
		
		if (infos.isPlaying){
			/* Pause  */
			nbControls++;
			Intent pauseIntent = new Intent("music-controls-pause");
			PendingIntent pausePendingIntent = PendingIntent.getBroadcast(context, 1, pauseIntent, 0);
			builder.addAction(this.getResourceId(infos.pauseIcon, android.R.drawable.ic_media_pause), "", pausePendingIntent);
		} else {
			/* Play  */
			nbControls++;
			Intent playIntent = new Intent("music-controls-play");
			PendingIntent playPendingIntent = PendingIntent.getBroadcast(context, 1, playIntent, 0);
			builder.addAction(this.getResourceId(infos.playIcon, android.R.drawable.ic_media_play), "", playPendingIntent);
		}
		
		nbControls++;
		Intent forwardIntent = new Intent("music-controls-forward");
		PendingIntent forwardPendingIntent = PendingIntent.getBroadcast(context, 1, forwardIntent, 0);
		builder.addAction(this.getResourceId(infos.nextIcon, android.R.drawable.ic_media_ff), "", forwardPendingIntent);
		
		/* Next */
		if (infos.hasNext){
			nbControls++;
			Intent nextIntent = new Intent("music-controls-next");
			PendingIntent nextPendingIntent = PendingIntent.getBroadcast(context, 1, nextIntent, 0);
			builder.addAction(this.getResourceId(infos.nextIcon, android.R.drawable.ic_media_next), "", nextPendingIntent);
		}
		
	
		/* Close */
		if (infos.hasClose){
			nbControls++;
			Intent destroyIntent = new Intent("music-controls-destroy");
			PendingIntent destroyPendingIntent = PendingIntent.getBroadcast(context, 1, destroyIntent, 0);
			builder.addAction(this.getResourceId(infos.closeIcon, android.R.drawable.ic_menu_close_clear_cancel), "", destroyPendingIntent);
		}

		//If 5.0 >= use MediaStyle
		if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP){
			int[] args = new int[nbControls];
			for (int i = 0; i < nbControls; ++i) {
				args[i] = i;
			}
			
			// new Notification.MediaStyle();
			MediaStyle mediaStyle = new MediaStyle();
			mediaStyle.setMediaSession(this.mediaSessionCompat.getSessionToken());
			mediaStyle.setShowActionsInCompactView(args);
			
			builder.setStyle(mediaStyle);
		}
		
		/*
		if (Build.VERSION.SDK_INT > Build.VERSION_CODES.M) {
            MediaStyle style = new MediaStyle();
            
            // MediaSession session = MediaSessionCompat.getMediaSession();
            style.setMediaSession(this.mediaSessionCompat.getSessionToken());

            int controlCount = 0;
            if(hasControl(PlaybackStateCompat.ACTION_PLAY) || hasControl(PlaybackStateCompat.ACTION_PAUSE) || hasControl(PlaybackStateCompat.ACTION_PLAY_PAUSE)) {
                controlCount += 1;
            }
            if(hasControl(PlaybackStateCompat.ACTION_SKIP_TO_NEXT)) {
                controlCount += 1;
            }
            if(hasControl(PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS)) {
                controlCount += 1;
            }
            if(hasControl(PlaybackStateCompat.ACTION_FAST_FORWARD)) {
                controlCount += 1;
            }
            if(hasControl(PlaybackStateCompat.ACTION_REWIND)) {
                controlCount += 1;
            }
            int[] actions = new int[controlCount];
            for(int i=0; i<actions.length; i++) {
                actions[i] = i;
            }
            style.setShowActionsInCompactView(actions);
            nb.setStyle(style);
        }
        */
		
		
		this.notificationBuilder = builder;
	}

	private int getResourceId(String name, int fallback){
		return fallback;
		/*
		try{
			if(name.isEmpty()){
				return fallback;
			}

			int resId = this.cordovaActivity.getResources().getIdentifier(name, "drawable", this.cordovaActivity.getPackageName());
			return resId == 0 ? fallback : resId;
		}
		catch(Exception ex){
			return fallback;
		}
		*/
	}

	public void destroy(){
		this.notificationManager.cancel(this.notificationID);
		this.onNotificationDestroyed();
	}
	protected void onNotificationUpdated(Notification notification) 
	
	{}
	protected void onNotificationDestroyed() {
		
	}
}
