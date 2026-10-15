import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, RotateCcw, Volume2, Sparkles, Check, Star, ArrowLeft, ArrowRight, Snail } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VocabularyWord, AppLanguage, TrainingLanguage } from '../types';
import { UI_TEXT } from '../translations';
import { speakFrench, speakEnglish, playSound, calculateSimilarity } from '../utils/audio';

interface PronunciationTrainerProps {
  words: VocabularyWord[];
  onWordMastered: (id: string) => void;
  appLang: AppLanguage;
  trainingLang: TrainingLanguage;
}

export const PronunciationTrainer: React.FC<PronunciationTrainerProps> = ({
  words,
  onWordMastered,
  appLang,
  trainingLang,
}) => {
  const t = appLang === 'en' ? UI_TEXT.en : UI_TEXT.ar;
  const isEnglishTrack = trainingLang === 'en';

  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentWord = words[selectedIndex] || words[0];

  const targetWord = isEnglishTrack ? currentWord.englishMeaning : currentWord.french;
  const currentSyllables = isEnglishTrack
    ? currentWord.englishSyllables || [currentWord.englishMeaning]
    : currentWord.syllables;

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [speechResult, setSpeechResult] = useState<{
    transcript: string;
    similarity: number;
    feedback: string;
    stars: number;
  } | null>(null);
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordedAudioElementRef = useRef<HTMLAudioElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Clean up recorded audio url when word changes
  useEffect(() => {
    setRecordedAudioUrl(null);
    setSpeechResult(null);
    setIsRecording(false);
    setIsListeningSpeech(false);
  }, [selectedIndex, trainingLang]);

  const handlePlayTeacher = (speed: 'normal' | 'slow' = 'normal') => {
    playSound('pop');
    if (isEnglishTrack) {
      speakEnglish(targetWord, speed);
    } else {
      speakFrench(targetWord, speed);
    }
  };

  const startRecording = async () => {
    try {
      setSpeechResult(null);
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      playSound('click');

      // Start SpeechRecognition in target training language (en-US or fr-FR)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = isEnglishTrack ? 'en-US' : 'fr-FR';
          recognition.continuous = false;
          recognition.interimResults = false;
          recognitionRef.current = recognition;
          setIsListeningSpeech(true);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            const primaryTarget = targetWord.split('/')[0].trim();
            const similarity = calculateSimilarity(transcript, primaryTarget);

            let stars = 1;
            let feedback = appLang === 'en'
              ? 'Good try! Listen to the teacher again and give it another shot.'
              : 'محاولة جيدة يا بطلة! استمعي لنطق المعلم مجدداً وجربي مرة أخرى.';

            if (similarity >= 0.75) {
              stars = 3;
              feedback = appLang === 'en'
                ? `Outstanding! Authentic and clear ${isEnglishTrack ? 'English' : 'French'} pronunciation 🌟`
                : `رائع جداً ومبهر! نطق ${isEnglishTrack ? 'إنجليزي' : 'فرنسي'} دقيق وواضح 🌟`;
              playSound('celebration');
              confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
              onWordMastered(currentWord.id);
            } else if (similarity >= 0.45) {
              stars = 2;
              feedback = appLang === 'en'
                ? 'Very close! Great effort, try to polish the vowel sounds.'
                : 'قريب جداً وممتاز! انتبهي فقط لحروف المد ومخارج الصوت.';
              playSound('correct');
            } else {
              playSound('wrong');
            }

            setSpeechResult({
              transcript,
              similarity,
              feedback,
              stars,
            });
            setIsListeningSpeech(false);
          };

          recognition.onerror = () => {
            setIsListeningSpeech(false);
          };

          recognition.onend = () => {
            setIsListeningSpeech(false);
          };

          recognition.start();
        } catch {
          setIsListeningSpeech(false);
        }
      }
    } catch {
      alert(appLang === 'en' ? 'Please allow microphone access to record and check pronunciation.' : 'يرجى السماح بالوصول للمايكروفون للتمكن من تسجيل الصوت وتدقيق النطق.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      playSound('click');
    }
    if (recognitionRef.current && isListeningSpeech) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
  };

  const playRecordedAudio = () => {
    if (!recordedAudioUrl) return;
    if (recordedAudioElementRef.current) {
      recordedAudioElementRef.current.pause();
    }
    const audio = new Audio(recordedAudioUrl);
    recordedAudioElementRef.current = audio;
    setIsPlayingRecorded(true);
    audio.play();
    audio.onended = () => setIsPlayingRecorded(false);
    audio.onerror = () => setIsPlayingRecorded(false);
  };

  const categoryLabel =
    appLang === 'en'
      ? currentWord.categoryLabelEn || currentWord.category
      : currentWord.categoryLabelAr;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Banner */}
      <div className={`rounded-3xl p-6 text-white shadow-xl relative overflow-hidden transition-colors ${
        isEnglishTrack
          ? 'bg-gradient-to-l from-blue-900 via-indigo-900 to-teal-900'
          : 'bg-gradient-to-l from-indigo-900 via-indigo-800 to-purple-900'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-right">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isEnglishTrack ? 'مختبر التدقيق واللفظ الإنجليزي 🇬🇧' : 'مختبر التدقيق واللفظ الفرنسي 🇫🇷'}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black">
              {isEnglishTrack
                ? 'تدربي على نطق الكلمات الإنجليزية مع الأستاذ الذكي 🎙️'
                : t.labTitle}
            </h2>
            <p className="text-indigo-100 text-sm max-w-xl">
              {isEnglishTrack
                ? 'استمعي لنطق الكلمة الإنجليزية بالسرعة الطبيعية والبطيئة، سجّلي صوتكِ بالمايكروفون وقارنيه مع النطق الأصلي!'
                : t.labDesc}
            </p>
          </div>

          {/* Quick Word Navigator Dropdown */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 text-slate-800">
            <select
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
              className="bg-white text-slate-800 font-bold text-sm px-4 py-2 rounded-xl border-none outline-none cursor-pointer"
            >
              {words.map((w, idx) => (
                <option key={w.id} value={idx}>
                  #{w.orderNumber} {isEnglishTrack ? w.englishMeaning : w.french} - {w.arabicMeaning.slice(0, 18)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Pronunciation Card */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border-2 border-indigo-100 space-y-8">
        {/* Word Display Section */}
        <div className="text-center space-y-4">
          <div className="inline-block">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {isEnglishTrack ? '🇬🇧 كلمة إنجليزية' : '🇫🇷 كلمة فرنسية'} #{currentWord.orderNumber} • {categoryLabel}
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 font-french tracking-wider mt-2 select-all" dir="ltr">
              {targetWord}
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="bg-amber-100/70 border border-amber-300/80 text-amber-950 px-4 py-2 rounded-2xl text-lg font-black tracking-wide flex items-center gap-2">
              <span className="text-xs text-amber-700 font-bold">النطق بالعربي:</span>
              <span>{isEnglishTrack ? (currentWord.englishArabicPhonetic || currentWord.englishMeaning) : currentWord.arabicPhonetic}</span>
            </div>

            <div className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-mono text-sm" dir="ltr">
              {isEnglishTrack ? (currentWord.ipaEnglish || currentWord.ipa) : currentWord.ipa}
            </div>

            <div className="text-xl font-bold text-indigo-900 px-4 py-1.5 bg-indigo-50/80 rounded-2xl">
              {currentWord.arabicMeaning}
            </div>
          </div>
        </div>

        {/* Syllable-by-syllable focus */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-3">
          <p className="text-xs font-bold text-slate-500">
            {isEnglishTrack
              ? 'تجزئة الكلمة الإنجليزية لمقاطع صوتية (انقري على أي مقطع لسماعه لوحده):'
              : t.syllablesInstruction}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3" dir="ltr">
            {currentSyllables.map((s, idx) => {
              if (s === '—') return <span key={idx} className="text-slate-400 font-bold">/</span>;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    playSound('pop');
                    if (isEnglishTrack) {
                      speakEnglish(s, 'slow');
                    } else {
                      speakFrench(s, 'slow');
                    }
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-white border-2 border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 text-indigo-700 font-french font-bold text-lg shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Click to hear this syllable"
                >
                  {s} 🔊
                </button>
              );
            })}
          </div>
        </div>

        {/* Listen vs Record Dual Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Step 1: Listen to Tutor */}
          <div className="bg-gradient-to-b from-indigo-50 to-white border-2 border-indigo-200/80 rounded-3xl p-6 space-y-5 text-center flex flex-col justify-between">
            <div className="space-y-2">
              <div className={`w-12 h-12 mx-auto rounded-2xl text-white flex items-center justify-center font-bold text-xl shadow-md ${
                isEnglishTrack ? 'bg-blue-600 shadow-blue-200' : 'bg-indigo-600 shadow-indigo-200'
              }`}>
                1
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                {isEnglishTrack ? 'استمعي للمعلم بالإنجليزية' : t.step1Title}
              </h3>
              <p className="text-xs text-slate-500">
                {isEnglishTrack ? 'دربي أذنكِ على النطق الإنجليزي الواضح' : t.step1Desc}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handlePlayTeacher('normal')}
                className={`w-full py-3.5 px-4 rounded-2xl active:scale-98 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  isEnglishTrack ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-300' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-300'
                }`}
              >
                <Volume2 className="w-5 h-5 text-indigo-200" />
                <span>{isEnglishTrack ? 'نطق إنجليزي أصيل (سرعة طبيعية)' : t.normalSpeed}</span>
              </button>

              <button
                onClick={() => handlePlayTeacher('slow')}
                className="w-full py-3 px-4 rounded-2xl bg-white border-2 border-indigo-300 hover:bg-indigo-50 active:scale-98 text-indigo-700 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Snail className="w-5 h-5 text-indigo-500" />
                <span>{t.slowSpeed}</span>
              </button>
            </div>

            <div className="text-[12px] bg-indigo-100/60 text-indigo-900 rounded-xl p-3 text-right">
              💡 <span className="font-bold">{t.teacherTip}</span>{' '}
              {isEnglishTrack
                ? (currentWord.englishPronunciationTipAr || currentWord.englishPronunciationTipEn || currentWord.pronunciationTip)
                : currentWord.pronunciationTip}
            </div>
          </div>

          {/* Step 2: Record Your Own Voice */}
          <div className="bg-gradient-to-b from-purple-50 to-white border-2 border-purple-200/80 rounded-3xl p-6 space-y-5 text-center flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-purple-200">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                {t.step2Title}
              </h3>
              <p className="text-xs text-slate-500">
                {t.step2Desc}
              </p>
            </div>

            {/* Recording Controls */}
            <div className="space-y-3">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-pink-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Mic className="w-5 h-5 animate-pulse" />
                  <span>{t.recordBtn}</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-rose-200 flex items-center justify-center gap-2 cursor-pointer transition-all animate-pulse"
                >
                  <Square className="w-5 h-5 fill-current" />
                  <span>{t.recordingActive}</span>
                </button>
              )}

              {/* Play Recorded Audio */}
              {recordedAudioUrl && (
                <div className="bg-purple-100/70 border border-purple-200 rounded-2xl p-3 flex items-center justify-between gap-3">
                  <button
                    onClick={playRecordedAudio}
                    className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Play className={`w-4 h-4 ${isPlayingRecorded ? 'animate-spin' : ''}`} />
                    <span>{isPlayingRecorded ? 'Playing...' : t.playRecorded}</span>
                  </button>

                  <button
                    onClick={startRecording}
                    className="p-2 rounded-xl bg-white text-purple-700 hover:bg-purple-50 border border-purple-200 cursor-pointer"
                    title="Re-record"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Speech Recognition Feedback Box */}
            {speechResult ? (
              <div className="bg-white border-2 border-purple-200 rounded-2xl p-4 text-right space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900">{t.autoEval}</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < speechResult.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs font-bold text-purple-950">
                  {speechResult.feedback}
                </p>

                <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg" dir="ltr">
                  Recognized ({isEnglishTrack ? 'en-US' : 'fr-FR'}):{' '}
                  <span className="font-bold text-slate-800">"{speechResult.transcript}"</span>
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-slate-600 bg-purple-50 rounded-xl p-3">
                🎧 {isEnglishTrack
                  ? 'المايكروفون يستمع للنطق بالإنجليزية الأمريكية/البريطانية وسيقيم دقة لفظك بالنجوم!'
                  : 'المايكروفون سيقوم بتحليل نطقك ومقارنته لإعطائك النجوم والتشجيع!'}
              </div>
            )}
          </div>
        </div>

        {/* Student Self-Verification Checklist */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{isEnglishTrack ? 'قائمة التدقيق لنطق الكلمة الإنجليزية:' : t.checklistTitle}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2">
              <span className="text-emerald-500 font-bold text-base">✓</span>
              <span>{isEnglishTrack ? 'هل انتبهتِ للحروف الصامتة مثل gh في neighbor؟' : t.check1}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2">
              <span className="text-emerald-500 font-bold text-base">✓</span>
              <span>{isEnglishTrack ? 'هل نطقتِ حروف المد مثل ea في dear و meet بوضوح؟' : t.check2}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2">
              <span className="text-emerald-500 font-bold text-base">✓</span>
              <span>{isEnglishTrack ? 'هل طبقتِ قاعدة th باللسان أو magic e؟' : t.check3}</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
            disabled={selectedIndex === 0}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            <span>{t.prevWord}</span>
          </button>

          <span className="text-sm font-bold text-slate-500">
            {selectedIndex + 1} / {words.length}
          </span>

          <button
            onClick={() => setSelectedIndex((prev) => Math.min(words.length - 1, prev + 1))}
            disabled={selectedIndex === words.length - 1}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-indigo-200"
          >
            <span>{t.nextWord}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
