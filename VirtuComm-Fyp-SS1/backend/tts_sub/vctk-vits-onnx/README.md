---
tags:
- audio
- text-to-speech
- onnx
inference: false
language: en
datasets:
- CSTR-Edinburgh/vctk
license: apache-2.0
library_name: txtai
---

# ESPnet VITS Text-to-Speech (TTS) Model for ONNX

[espnet/kan-bayashi_vctk_vits](https://huggingface.co/espnet/kan-bayashi_vctk_tts_train_multi_spk_vits_raw_phn_tacotron_g2p_en_no_space_train.total_count.ave) exported to ONNX. This model is an ONNX export using the [espnet_onnx](https://github.com/espnet/espnet_onnx) library.

## Usage with txtai

[txtai](https://github.com/neuml/txtai) has a built in Text to Speech (TTS) pipeline that makes using this model easy. 

_Note the following example requires txtai >= 7.5_

```python
import soundfile as sf

from txtai.pipeline import TextToSpeech

# Build pipeline
tts = TextToSpeech("NeuML/vctk-vits-onnx")

# Generate speech with speaker id
speech, rate = tts("Say something here", speaker=15)

# Write to file
sf.write("out.wav", speech, rate)
```

## Usage with ONNX

This model can also be run directly with ONNX provided the input text is tokenized. Tokenization can be done with [ttstokenizer](https://github.com/neuml/ttstokenizer).

Note that the txtai pipeline has additional functionality such as batching large inputs together that would need to be duplicated with this method.

```python
import numpy as np
import onnxruntime
import soundfile as sf
import yaml

from ttstokenizer import TTSTokenizer

# This example assumes the files have been downloaded locally
with open("vctk-vits-onnx/config.yaml", "r", encoding="utf-8") as f:
    config = yaml.safe_load(f)

# Create model
model = onnxruntime.InferenceSession(
    "vctk-vits-onnx/model.onnx",
    providers=["CPUExecutionProvider"]
)

# Create tokenizer
tokenizer = TTSTokenizer(config["token"]["list"])

# Tokenize inputs
inputs = tokenizer("Say something here")

# Generate speech
outputs = model.run(None, {"text": inputs, "sids": np.array([15])})

# Write to file
sf.write("out.wav", outputs[0], 22050)
```

## How to export

More information on how to export ESPnet models to ONNX can be [found here](https://github.com/espnet/espnet_onnx#text2speech-inference).

## Speaker reference

The [CSTR VCTK Corpus](https://datashare.ed.ac.uk/handle/10283/3443) includes speech data uttered by native speakers of English with various accents.

When using this model, set a `speaker` id from the reference table below. The `ref` column corresponds to the id in the VCTK dataset.

|   SPEAKER |  REF |   AGE | GENDER   | ACCENTS        | REGION           |
|----------:|-----:|------:|:---------|:---------------|:-----------------|
|         1 |  225 |    23 | F        | English        | Southern England |
|         2 |  226 |    22 | M        | English        | Surrey           |
|         3 |  227 |    38 | M        | English        | Cumbria          |
|         4 |  228 |    22 | F        | English        | Southern England |
|         5 |  229 |    23 | F        | English        | Southern England |
|         6 |  230 |    22 | F        | English        | Stockton-on-tees |
|         7 |  231 |    23 | F        | English        | Southern England |
|         8 |  232 |    23 | M        | English        | Southern England |
|         9 |  233 |    23 | F        | English        | Staffordshire    |
|        10 |  234 |    22 | F        | Scottish       | West Dumfries    |
|        11 |  236 |    23 | F        | English        | Manchester       |
|        12 |  237 |    22 | M        | Scottish       | Fife             |
|        13 |  238 |    22 | F        | Northern Irish | Belfast          |
|        14 |  239 |    22 | F        | English        | SW England       |
|        15 |  240 |    21 | F        | English        | Southern England |
|        16 |  241 |    21 | M        | Scottish       | Perth            |
|        17 |  243 |    22 | M        | English        | London           |
|        18 |  244 |    22 | F        | English        | Manchester       |
|        19 |  245 |    25 | M        | Irish          | Dublin           |
|        20 |  246 |    22 | M        | Scottish       | Selkirk          |
|        21 |  247 |    22 | M        | Scottish       | Argyll           |
|        22 |  248 |    23 | F        | Indian         |                  |
|        23 |  249 |    22 | F        | Scottish       | Aberdeen         |
|        24 |  250 |    22 | F        | English        | SE England       |
|        25 |  251 |    26 | M        | Indian         |                  |
|        26 |  252 |    22 | M        | Scottish       | Edinburgh        |
|        27 |  253 |    22 | F        | Welsh          | Cardiff          |
|        28 |  254 |    21 | M        | English        | Surrey           |
|        29 |  255 |    19 | M        | Scottish       | Galloway         |
|        30 |  256 |    24 | M        | English        | Birmingham       |
|        31 |  257 |    24 | F        | English        | Southern England |
|        32 |  258 |    22 | M        | English        | Southern England |
|        33 |  259 |    23 | M        | English        | Nottingham       |
|        34 |  260 |    21 | M        | Scottish       | Orkney           |
|        35 |  261 |    26 | F        | Northern Irish | Belfast          |
|        36 |  262 |    23 | F        | Scottish       | Edinburgh        |
|        37 |  263 |    22 | M        | Scottish       | Aberdeen         |
|        38 |  264 |    23 | F        | Scottish       | West Lothian     |
|        39 |  265 |    23 | F        | Scottish       | Ross             |
|        40 |  266 |    22 | F        | Irish          | Athlone          |
|        41 |  267 |    23 | F        | English        | Yorkshire        |
|        42 |  268 |    23 | F        | English        | Southern England |
|        43 |  269 |    20 | F        | English        | Newcastle        |
|        44 |  270 |    21 | M        | English        | Yorkshire        |
|        45 |  271 |    19 | M        | Scottish       | Fife             |
|        46 |  272 |    23 | M        | Scottish       | Edinburgh        |
|        47 |  273 |    23 | M        | English        | Suffolk          |
|        48 |  274 |    22 | M        | English        | Essex            |
|        49 |  275 |    23 | M        | Scottish       | Midlothian       |
|        50 |  276 |    24 | F        | English        | Oxford           |
|        51 |  277 |    23 | F        | English        | NE England       |
|        52 |  278 |    22 | M        | English        | Cheshire         |
|        53 |  279 |    23 | M        | English        | Leicester        |
|        54 |  280 |       |          | Unknown        |                  |
|        55 |  281 |    29 | M        | Scottish       | Edinburgh        |
|        56 |  282 |    23 | F        | English        | Newcastle        |
|        57 |  283 |    24 | F        | Irish          | Cork             |
|        58 |  284 |    20 | M        | Scottish       | Fife             |
|        59 |  285 |    21 | M        | Scottish       | Edinburgh        |
|        60 |  286 |    23 | M        | English        | Newcastle        |
|        61 |  287 |    23 | M        | English        | York             |
|        62 |  288 |    22 | F        | Irish          | Dublin           |
|        63 |  292 |    23 | M        | Northern Irish | Belfast          |
|        64 |  293 |    22 | F        | Northern Irish | Belfast          |
|        65 |  294 |    33 | F        | American       | San Francisco    |
|        66 |  295 |    23 | F        | Irish          | Dublin           |
|        67 |  297 |    20 | F        | American       | New York         |
|        68 |  298 |    19 | M        | Irish          | Tipperary        |
|        69 |  299 |    25 | F        | American       | California       |
|        70 |  300 |    23 | F        | American       | California       |
|        71 |  301 |    23 | F        | American       | North Carolina   |
|        72 |  302 |    20 | M        | Canadian       | Montreal         |
|        73 |  303 |    24 | F        | Canadian       | Toronto          |
|        74 |  304 |    22 | M        | Northern Irish | Belfast          |
|        75 |  305 |    19 | F        | American       | Philadelphia     |
|        76 |  306 |    21 | F        | American       | New York         |
|        77 |  307 |    23 | F        | Canadian       | Ontario          |
|        78 |  308 |    18 | F        | American       | Alabama          |
|        79 |  310 |    21 | F        | American       | Tennessee        |
|        80 |  311 |    21 | M        | American       | Iowa             |
|        81 |  312 |    19 | F        | Canadian       | Hamilton         |
|        82 |  313 |    24 | F        | Irish          | County Down      |
|        83 |  314 |    26 | F        | South African  | Cape Town        |
|        84 |  316 |    20 | M        | Canadian       | Alberta          |
|        85 |  317 |    23 | F        | Canadian       | Hamilton         |
|        86 |  318 |    32 | F        | American       | Napa             |
|        87 |  323 |    19 | F        | South African  | Pretoria         |
|        88 |  326 |    26 | M        | Australian     | Sydney           |
|        89 |  329 |    23 | F        | American       |                  |
|        90 |  330 |    26 | F        | American       |                  |
|        91 |  333 |    19 | F        | American       | Indiana          |
|        92 |  334 |    18 | M        | American       | Chicago          |
|        93 |  335 |    25 | F        | New Zealand    | English          |
|        94 |  336 |    18 | F        | South African  | Johannesburg     |
|        95 |  339 |    21 | F        | American       | Pennsylvania     |
|        96 |  340 |    18 | F        | Irish          | Dublin           |
|        97 |  341 |    26 | F        | American       | Ohio             |
|        98 |  343 |    27 | F        | Canadian       | Alberta          |
|        99 |  345 |    22 | M        | American       | Florida          |
|       100 |  347 |    26 | M        | South African  | Johannesburg     |
|       101 |  351 |    21 | F        | Northern Irish | Derry            |
|       102 |  360 |    19 | M        | American       | New Jersey       |
|       103 |  361 |    19 | F        | American       | New Jersey       |
|       104 |  362 |    29 | F        | American       |                  |
|       105 |  363 |    22 | M        | Canadian       | Toronto          |
|       106 |  364 |    23 | M        | Irish          | Donegal          |
|       107 |  374 |    28 | M        | Australian     | English          |
