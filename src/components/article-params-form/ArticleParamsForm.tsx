import { FormEvent, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import {
	ArticleStateType,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
	OptionType,
} from 'src/constants/articleProps';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	articleState: ArticleStateType;
	onChange: (newState: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	articleState,
	onChange,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [formState, setFormState] = useState(articleState);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const closeForm = (event: MouseEvent) => {
			const { target } = event;

			if (target instanceof Node && !containerRef.current?.contains(target)) {
				setIsOpen(false);
			}
		};

		if (!isOpen) {
			return;
		}

		window.addEventListener('mousedown', closeForm);

		return () => {
			window.removeEventListener('mousedown', closeForm);
		};
	}, [isOpen]);

	const setStateOption =
		(fieldName: keyof ArticleStateType) => (option: OptionType) => {
			setFormState((currentState) => ({
				...currentState,
				[fieldName]: option,
			}));
		};

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		onChange(formState);
	};

	const handleReset = (event: FormEvent) => {
		event.preventDefault();
		setFormState(defaultArticleState);
		onChange(defaultArticleState);
	};

	return (
		<div ref={containerRef}>
			<ArrowButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
			<aside
				className={clsx(styles.container, { [styles.container_open]: isOpen })}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
					<div className={styles.params}>
						<Select
							selected={formState.fontFamilyOption}
							options={fontFamilyOptions}
							onChange={setStateOption('fontFamilyOption')}
							title='Шрифт'
						/>
						<RadioGroup
							selected={formState.fontSizeOption}
							options={fontSizeOptions}
							onChange={setStateOption('fontSizeOption')}
							name='font-size'
							title='Размер шрифта'
						/>
						<Select
							selected={formState.fontColor}
							options={fontColors}
							onChange={setStateOption('fontColor')}
							title='Цвет шрифта'
						/>
						<Separator />
						<Select
							selected={formState.backgroundColor}
							options={backgroundColors}
							onChange={setStateOption('backgroundColor')}
							title='Цвет фона'
						/>
						<Select
							selected={formState.contentWidth}
							options={contentWidthArr}
							onChange={setStateOption('contentWidth')}
							title='Ширина контента'
						/>
					</div>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</div>
	);
};
