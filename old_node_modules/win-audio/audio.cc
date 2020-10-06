#include <stdio.h>
#include <windows.h>
#include <mmdeviceapi.h>
#include <endpointvolume.h>
#include <math.h>
#include <node.h>

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Integer;
using v8::Object;
using v8::Value;

IAudioEndpointVolume* getVolume(int mic){
  HRESULT hr;
  IMMDeviceEnumerator *enumerator = NULL;
  IAudioEndpointVolume *volume = NULL;
  IMMDevice *defaultDevice = NULL;
  CoInitialize(NULL);
  hr = CoCreateInstance(__uuidof(MMDeviceEnumerator), NULL, CLSCTX_INPROC_SERVER, __uuidof(IMMDeviceEnumerator), (LPVOID *) &enumerator);
  hr = enumerator->GetDefaultAudioEndpoint(mic ? eCapture : eRender, eConsole, &defaultDevice);
  if (hr != 0) {
    return volume;
  }
  hr = defaultDevice->Activate(__uuidof(IAudioEndpointVolume), CLSCTX_INPROC_SERVER, NULL, (LPVOID *) &volume);
  enumerator->Release();
  defaultDevice->Release();
  CoUninitialize();
  return volume;
}

void get(const FunctionCallbackInfo<Value>& args) {
  float volume = 0;
  int mic = (int) args[0]->IntegerValue();
  IAudioEndpointVolume *temp_volume = NULL;
  temp_volume = getVolume(mic);
  if (temp_volume == NULL) {
    args.GetReturnValue().Set(v8::Integer::New(args.GetIsolate(), -999));
    return;
  }
  temp_volume->GetMasterVolumeLevelScalar(&volume);
  int value = (int) round(volume*100);
  args.GetReturnValue().Set(v8::Integer::New(args.GetIsolate(), value));
}

void isMute(const FunctionCallbackInfo<Value>& args) {
  int mute = 0;
  int mic = (int) args[0]->IntegerValue();
  IAudioEndpointVolume *temp_volume = NULL;
  temp_volume = getVolume(mic);

  if (temp_volume == NULL) {
    args.GetReturnValue().Set(v8::Integer::New(args.GetIsolate(), -999));
    return;
  }

  temp_volume->GetMute(&mute);
  args.GetReturnValue().Set(v8::Integer::New(args.GetIsolate(), mute));
  
}

void mute(const FunctionCallbackInfo<Value>& args) {
  int mic = (int) args[0]->IntegerValue();
  int mute = (int) args[1]->IntegerValue();

  IAudioEndpointVolume *temp_volume = NULL;
  temp_volume = getVolume(mic);

  if (temp_volume == NULL) {
    return;
  }

  temp_volume->SetMute(mute, NULL);

}

void set(const FunctionCallbackInfo<Value>& args) {
  float newVolume = (float) args[0]->IntegerValue()/100.0f;
  int mic = (int) args[1]->IntegerValue();

  IAudioEndpointVolume *temp_volume = NULL;
  temp_volume = getVolume(mic);

  if (temp_volume == NULL) {
    return;
  }

  temp_volume->SetMasterVolumeLevelScalar(newVolume, NULL);

}

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "get", get);
  NODE_SET_METHOD(exports, "set", set);
  NODE_SET_METHOD(exports, "mute", mute);
  NODE_SET_METHOD(exports, "isMute", isMute);
}

NODE_MODULE(addon, init)
