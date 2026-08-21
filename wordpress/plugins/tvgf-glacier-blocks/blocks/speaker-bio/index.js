( function ( blocks, element, blockEditor, components ) {
	var el = element.createElement;
	var registerBlockType = blocks.registerBlockType;
	var useBlockProps = blockEditor.useBlockProps;
	var MediaUpload = blockEditor.MediaUpload;
	var MediaUploadCheck = blockEditor.MediaUploadCheck;
	var TextControl = components.TextControl;
	var TextareaControl = components.TextareaControl;
	var Button = components.Button;

	registerBlockType( 'tvgf/speaker-bio', {
		edit: function ( props ) {
			var a = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps( { className: 'tvgf-speaker-bio-edit' } );

			return el(
				'div',
				blockProps,
				el( 'p', {}, el( 'strong', {}, 'Speaker Bio' ) ),
				el(
					'div',
					{ className: 'tvgf-speaker-bio-photo' },
					a.photoUrl
						? el( 'img', { src: a.photoUrl, alt: a.photoAlt, style: { maxWidth: '120px', display: 'block' } } )
						: null,
					el(
						MediaUploadCheck,
						{},
						el( MediaUpload, {
							onSelect: function ( media ) {
								setAttributes( {
									photoId: media.id,
									photoUrl: media.url,
									photoAlt: media.alt || '',
								} );
							},
							allowedTypes: [ 'image' ],
							value: a.photoId,
							render: function ( obj ) {
								return el(
									Button,
									{ variant: 'secondary', onClick: obj.open },
									a.photoUrl ? 'Replace photo' : 'Upload photo (optional)'
								);
							},
						} )
					)
				),
				el( TextControl, {
					label: 'Name',
					value: a.name,
					onChange: function ( v ) {
						setAttributes( { name: v } );
					},
				} ),
				el( TextControl, {
					label: 'Role / Title',
					value: a.role,
					onChange: function ( v ) {
						setAttributes( { role: v } );
					},
				} ),
				el( TextControl, {
					label: 'Organisation',
					value: a.org,
					onChange: function ( v ) {
						setAttributes( { org: v } );
					},
				} ),
				el( TextareaControl, {
					label: 'Short bio',
					value: a.bio,
					onChange: function ( v ) {
						setAttributes( { bio: v } );
					},
				} )
			);
		},
		save: function ( props ) {
			var a = props.attributes;
			var blockProps = blockEditor.useBlockProps.save( { className: 'tvgf-speaker-bio' } );
			return el(
				'div',
				blockProps,
				a.photoUrl
					? el( 'img', { className: 'tvgf-speaker-photo', src: a.photoUrl, alt: a.photoAlt } )
					: null,
				el(
					'div',
					{ className: 'tvgf-speaker-info' },
					el( 'div', { className: 'tvgf-speaker-name' }, a.name ),
					el( 'div', { className: 'tvgf-speaker-role' }, [ a.role, a.org ].filter( Boolean ).join( ', ' ) ),
					a.bio ? el( 'p', { className: 'tvgf-speaker-bio-text' }, a.bio ) : null
				)
			);
		},
	} );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components );
