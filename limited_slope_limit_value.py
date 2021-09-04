# -*- coding: utf-8 -*-

import os
from pathlib import Path
import urllib
import oyaml as yaml
import numpy as np
import scipy.signal
import soundfile as sf


def read_wav(file_path, expand=False):
    """Reads WAV file
    Args:
        file_path: Path to WAV file as string
        expand: Expand dimensions of a single track recording to produce 2-D array?
    Returns:
        - sampling frequency as integer
        - wav data as numpy array with one row per track, samples in range -1..1
    """
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f'File in path "{os.path.abspath(file_path)}" does not exist.')
    data, fs = sf.read(file_path)
    if len(data.shape) > 1:
        # Soundfile has tracks on columns, we want them on rows
        data = np.transpose(data)
    elif expand:
        data = np.expand_dims(data, axis=0)
    return fs, data


def str_presenter(dumper, data):
    if len(data.splitlines()) > 1:  # check for multiline string
        return dumper.represent_scalar('tag:yaml.org,2002:str', data, style='|')
    return dumper.represent_scalar('tag:yaml.org,2002:str', data)


yaml.add_representer(str, str_presenter)

welcome = '''#### {headphone}
Your task in this listening test is to select the option you prefer over others. There are 8 different
short song clips for total of 8 tests. Each clip has been processed with 4 slightly different equalization filters all
aiming to equalize {headphone} to Harman target. There are no right or wrong answers in this test, the goal of this
research is to find the optimal parameters for equalizing headphones automatically.

Your test results will be submitted automatically at the end of the test.

##### Before you start
Disable all equalization software and hardware if you have any running. The test is about comparing equalization filters
and therefore it's important that there are no other equalization filters active.

##### Important
Take this test only once. Population statistics will be calculated from all submissions and therefore it's important
that each person takes the test exactly one time. Don't repeat the test even if you feel like you've made some mistakes
during the test.

Take this test only if your {headphone} unit is the one measured by oratory1990 for his headphone measurement database.
Individual headphone units have slightly different frequency responses so the originally measured one should be used for
this study.

Take this test only if your headphone unit is in the exact same condition as it was when it was measured by oratory1990.
Don't take this test if you have since made any modifications to the headphone or the headphone has been repaired.
'''

base_url = 'https://abxtestscom-tests.storage.googleapis.com/limited-slope-limit-value'


def main():
    base_path = Path('limited_slope/filters')
    for dir_path in base_path.glob('*'):   # One config for each headphone
        headphone = dir_path.name
        out_path = Path(f'limited_slope/outputs/{headphone}')
        out_path.mkdir(parents=True, exist_ok=True)
        config = {
            'name': f'{dir_path.name} EQ Regularization',
            'welcome': {'description': welcome.format(headphone=headphone)},
            'options': [],
            'tests': [],
            'email': 'jaakko.o.pasanen@gmail.com'
        }

        for clip_path in Path('limited_slope/clips').glob('*'):  # Filter clips
            clip_name = clip_path.name.replace('.wav', '')
            fs, clip = read_wav(clip_path)
            clip = np.mean(clip, axis=0)  # Make mono

            options = []
            for filter_path in dir_path.glob('*.wav'):  # One option per filter-clip pair
                tag = f'{filter_path.name.replace(".wav", "")} db'  # Tag is the slope limit
                name = f'{clip_name} [{tag}]'
                target = f'{headphone}/{name}'
                link = f'{base_url}/{urllib.parse.quote(target)}.wav'
                options.append({
                    'name': name,
                    'audioUrl': link,
                    'tag': tag
                })

                fs, filt = read_wav(filter_path)
                filt = filt[0]
                filtered = scipy.signal.convolve(clip, filt, mode='same')
                sf.write(out_path.joinpath(f'{name}.wav'), filtered, 44100, 'PCM_16')

            config['options'] += options
            config['tests'].append({
                'name': clip_name,
                'testType': 'AB',
                'options': [opt['name'] for opt in options],
                'repeat': 3
            })

        with open(out_path.joinpath('config.yml'), 'w', encoding='utf-8') as fh:
            yaml.dump(config, fh, indent=2, width=999, allow_unicode=True, encoding='utf-8')
            config_link = f'{base_url}/{urllib.parse.quote(headphone)}/config.yml'
            print(f'<li><a href="{config_link}">{headphone}</a></li>')


if __name__ == '__main__':
    main()
