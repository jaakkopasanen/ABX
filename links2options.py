import sys
import urllib.parse
import oyaml as yaml


def main():
    with open(sys.argv[1], 'r') as fh:
        links = fh.read().strip().split('\n')

    pairs = dict()
    config = {
        'name': 'Put name here',
        'welcome': {'description': '|-'},
        'options': [],
        'tests': []
    }
    for link in links:
        name = urllib.parse.unquote(link.split('/')[-1]).replace('.wav?dl=0', '')
        tag = name.split("[")[1][:-1]
        name_without_tag = name.split('[')[0].strip()
        config['options'].append({
            'name': name,
            'audioUrl': link,
            'tag': tag
        })
        if name_without_tag not in pairs:
            pairs[name_without_tag] = []
        pairs[name_without_tag].append(name)

    for name, pair in pairs.items():
        config['tests'].append({
            'name': name,
            'testType': 'AB',
            'options': pair,
            'repeat': 3
        })

    with open('options.yml', 'w', encoding='utf-8') as fh:
        yaml.dump(config, fh, indent=2, width=999, allow_unicode=True, encoding='utf-8')


if __name__ == '__main__':
    main()
